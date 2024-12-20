'use client'; // Używamy 'use client' w Next.js, by oznaczyć, że to jest komponent klienta

import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  // Stan przechowujący aktualny motyw (ciemny lub jasny)
  const [darkMode, setDarkMode] = useState<boolean>();

  useEffect(() => {
    // Sprawdzamy preferencje użytkownika z localStorage lub domyślnie systemowe
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setDarkMode(storedTheme === 'dark');
    } else {
      // Jeśli brak zapisanych preferencji, ustalamy na podstawie systemowych ustawień
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Funkcja zmieniająca motyw
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // Zapisz preferencje w localStorage
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
    // Zmieniamy klasę 'dark' na elemencie <html>
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 pr-3 rounded-full bg-gray-200 dark:bg-neutral-800 text-neutral-800 dark:text-white"
    >
      {darkMode ? '🌙 Ciemny tryb' : '☀️ Jasny tryb'}
    </button>
  );
};

export default ThemeToggle;
