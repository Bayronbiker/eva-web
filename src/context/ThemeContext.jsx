import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('eva-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eva-theme', theme);
  }, [theme]);

  const setTheme = (next) => {
    setThemeState(next === 'dark' ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
