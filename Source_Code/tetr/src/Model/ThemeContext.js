import React, { createContext, useState, useEffect, useContext } from 'react';

/*
    ThemeContext: This context provides a way to manage and switch themes across the application.
    It stores the current theme in both state and localStorage, allowing persistence across sessions.
 */

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Try to get the theme from localStorage, fall back to 'bgb' if not found
    return localStorage.getItem('theme') || 'bgb';
  });

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    // Save the new theme to localStorage
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};