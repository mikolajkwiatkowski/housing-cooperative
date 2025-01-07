'use client'; // Używamy 'use client' w Next.js, by oznaczyć, że to jest komponent klienta

import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  // Stan przechowujący aktualny motyw (ciemny lub jasny)
  const [darkMode, setDarkMode] = useState<boolean>(false); // Domyślnie ustawiamy jasny motyw

  useEffect(() => {
    // Sprawdzamy preferencje użytkownika z localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      const isDark = storedTheme === 'dark';
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Jeśli brak zapisanych preferencji, domyślnie ustawiamy jasny motyw
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Funkcja zmieniająca motyw
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    // Zapisz preferencje w localStorage
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    // Zmieniamy klasę 'dark' na elemencie <html>
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 pr-3 rounded-full bg-gray-200 dark:bg-neutral-800 text-neutral-800 dark:text-white"
    >
      {darkMode ? '🌙 Ciemny tryb' : '☀️ Jasny tryb'}
    </button>
  );
};

export default ThemeToggle;
