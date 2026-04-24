import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post('/api/auth/register', { name, email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    const googleLoginByToken = async (token) => {
        // Fetch user profile using the token
        const { data } = await axios.get('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const userData = { ...data, token };
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    };

    const forgotPassword = async (email) => {
        const { data } = await axios.post('/api/auth/forgot-password', { email });
        return data;
    };

    const resetPassword = async (token, password) => {
        const { data } = await axios.post(`/api/auth/reset-password/${token}`, { password });
        return data;
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        try {
            await axios.post('/api/auth/logout');
        } catch (error) {
            console.error("Logout request failed, but local session is cleared.", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, googleLoginByToken, register, logout, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};
