import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return alert('Passwords do not match');
        }
        try {
            const data = await resetPassword(token, password);
            alert(data.message);
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Reset failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 pt-20 relative overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Soft background accents */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(5,150,105,0.05),transparent_50%)]"></div>

            <div className="w-full max-w-md bg-white p-10 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-emerald-100 relative z-10 transition-all">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl mb-6 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold font-heading text-slate-800 mb-3 tracking-tight">Set New Password</h1>
                    <p className="text-slate-500 font-medium">Please choose a strong password you haven't used before</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="group">
                        <label className="block text-sm font-semibold font-heading text-slate-700 mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">New Password</label>
                        <input 
                            type="password" 
                            placeholder="Min. 8 characters" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all"
                            required 
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-semibold font-heading text-slate-700 mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">Confirm Password</label>
                        <input 
                            type="password" 
                            placeholder="Repeat new password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all"
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4"
                    >
                        <span className="font-heading">Reset Password</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                </form>

                <div className="text-center mt-8">
                    <Link to="/login" className="text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors">
                        Remembered your password? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
