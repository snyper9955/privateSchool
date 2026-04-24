import React, { createContext, useContext, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ApiContext = createContext();

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {
    const { user, logout } = useAuth();

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: (import.meta.env.VITE_API_URL || '').replace(/\/+$/, ''),
        });

        // Add a request interceptor
        instance.interceptors.request.use(
            (config) => {
                const token = user?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add a response interceptor to handle 401s globally
        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Unauthorized - token expired or invalid
                    console.error('Session expired, logging out...');
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [user, logout]);

    return (
        <ApiContext.Provider value={api}>
            {children}
        </ApiContext.Provider>
    );
};
