import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

// Apply class instantly before first paint to prevent FOUC.
// Default is LIGHT MODE — only respect saved preference, ignore system preference.
const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('theme');
    // Explicit saved preference takes priority
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    // No saved preference → default to LIGHT (premium clean aesthetic)
    return false;
  } catch {
    return false;
  }
};

// Run immediately — not inside React lifecycle — to block FOUC
const initialDark = getInitialTheme();
if (initialDark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(initialDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
