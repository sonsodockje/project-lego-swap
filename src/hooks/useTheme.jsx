import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children, defaultTheme = 'bumblebee' }) {
    const getInitialTheme = () => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            if (
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dracula)').matches
            ) {
                return 'dracula';
            }
        }
        return defaultTheme;
    };

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.document) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    const contextValue = {
        setTheme,
        toggleTheme: () => {
            setTheme((prevTheme) =>
                prevTheme === 'dracula' ? 'bumblebee' : 'dracula',
            );
        },
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === null) {
        // ThemeProvider 내에서 useTheme 훅이 사용되지 않았을 때 에러 발생
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
