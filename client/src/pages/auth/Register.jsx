import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        apiUrl = apiUrl.replace(/\/+$/, '');
        window.location.href = `${apiUrl}/api/auth/google`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 sm:py-12 md:py-16 relative overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Soft background accents - optimized for all devices */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(5,150,105,0.05),transparent_50%)]"></div>

            <div className="w-full max-w-md mx-auto bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative z-10 transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
                <div className="text-center mb-6 sm:mb-8 md:mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 md:mb-6 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-slate-800 mb-2 tracking-tight">Create Account</h1>
                    <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium">Join our coaching community today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                    <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold font-heading text-slate-700 mb-1 sm:mb-1.5 ml-1 group-focus-within:text-emerald-600 transition-colors">
                            Full Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter your full name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                            required 
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold font-heading text-slate-700 mb-1 sm:mb-1.5 ml-1 group-focus-within:text-emerald-600 transition-colors">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                            required 
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold font-heading text-slate-700 mb-1 sm:mb-1.5 ml-1 group-focus-within:text-emerald-600 transition-colors">
                            Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="Min. 6 characters" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                            required 
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full mt-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-900 text-white font-bold py-3 sm:py-3.5 rounded-xl shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="font-heading text-sm sm:text-base">Creating account...</span>
                            </>
                        ) : (
                            <>
                                <span className="font-heading text-sm sm:text-base">Create Account</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>

                    <div className="relative my-5 sm:my-6 md:my-7">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 sm:px-4 text-slate-400 font-semibold tracking-wider text-[10px] sm:text-xs">Or continue with</span>
                        </div>
                    </div>

                    <button 
                        type="button"
                        onClick={handleGoogleRegister}
                        disabled={isLoading}
                        className="w-full bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold py-3 sm:py-3.5 rounded-xl shadow-sm transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 sm:gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        <span className="font-heading text-sm sm:text-base">Sign up with Google</span>
                    </button>
                </form>

                <div className="mt-6 sm:mt-8 md:mt-10 pt-5 sm:pt-6 md:pt-8 border-t border-slate-100 text-center">
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Already have an account? 
                        <Link 
                            to="/login" 
                            className="inline-block ml-1 sm:ml-2 text-emerald-600 hover:text-emerald-700 font-bold active:opacity-80 transition-colors"
                        >
                            Login Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;