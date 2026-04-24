import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme) {
            setTheme(theme);
        }
        setLoading(false);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, loading, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};