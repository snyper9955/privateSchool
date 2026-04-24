import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { speak } from '../utils/speak';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (user && user._id) {
            // Avoid duplicate connections in React 18 Strict Mode
            if (!socketRef.current) {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const newSocket = io(apiUrl, {
                    reconnection: true,
                    reconnectionAttempts: 10,
                    reconnectionDelay: 1000,
                    withCredentials: true,
                    transports: ['polling', 'websocket'] // Try polling first for better compatibility
                });

                socketRef.current = newSocket;
                setSocket(newSocket);

                newSocket.on('connect', () => {
                    console.log('Socket connected:', newSocket.id);
                    newSocket.emit('joinRoom', user._id);
                });

                newSocket.on('connect_error', (error) => {
                    console.error('Socket connection error:', error);
                });

                newSocket.on('paymentSuccess', (data) => {
                    const message = `Received ₹${data.amount} from ${data.customerName || 'Customer'}`;
                    speak(message);
                    toast.success(message, {
                        duration: 5000,
                        position: 'top-center',
                        style: {
                            background: '#10b981',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            padding: '1rem'
                        }
                    });
                });
            }

            return () => {
                if (socketRef.current) {
                    console.log('Closing socket connection...');
                    socketRef.current.disconnect();
                    socketRef.current = null;
                    setSocket(null);
                }
            };
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
