import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

// Connect once
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(apiUrl, {
  withCredentials: true,
  transports: ['websocket', 'polling'], // Fallback
});

const PaymentAnnouncer = () => {
    const { user } = useAuth();
    const userId = user ? user._id : null;
    const [language, setLanguage] = React.useState('hi'); // 'hi' or 'en'
    const [dailyTotal, setDailyTotal] = React.useState(0);

    const announceDailySummary = () => {
        const text = language === 'hi' 
            ? `Aaj total ${dailyTotal} rupaye prapt hue`
            : `Total collected today is ${dailyTotal} rupees`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (!userId) return;

        // Join personal room
        socket.emit('join', userId);

        // Listen for payment success from webhook
        socket.on('paymentSuccess', (data) => {
            console.log('New payment received:', data);
            setDailyTotal(prev => prev + data.amount);

            // 1. Play LOUD Notification Sound (Chime)
            const audio = new Audio('/notification.mp3'); 
            audio.play().catch(e => console.log('Audio play failed', e));

            // 2. Announce Voice
            let text = '';
            let lang = 'hi-IN';
            
            if (language === 'hi') {
                text = `${data.amount} rupaye ${data.customerName || 'customer'} se prapt hue!`;
                lang = 'hi-IN';
            } else {
                text = `Received ${data.amount} rupees from ${data.customerName || 'customer'}.`;
                lang = 'en-IN';
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.volume = 1.0;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            // Explicitly find a Hindi/English voice if possible
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
            if (selectedVoice) utterance.voice = selectedVoice;

            window.speechSynthesis.speak(utterance);
        });

        // Cleanup
        return () => {
            socket.off('paymentSuccess');
        };
    }, [userId, language]);

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-xl shadow-2xl border border-green-500 z-50 min-w-[200px]">
            <div className="flex justify-between items-center mb-2">
                <p className="font-bold flex items-center text-green-400">
                    <span className="mr-2 animate-pulse">●</span>
                    Soundbox Active
                </p>
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-800 text-xs border border-gray-700 rounded px-1 py-0.5 outline-none"
                >
                    <option value="hi">Hindi</option>
                    <option value="en">English</option>
                </select>
            </div>
            <p className="text-xs text-gray-400 mb-3">Speaker connect rakho 🔊</p>
            <button 
                onClick={announceDailySummary}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center"
            >
                <span className="mr-2">📊</span>
                Aaj Ki Summary
            </button>
        </div>
    );
};

export default PaymentAnnouncer;
