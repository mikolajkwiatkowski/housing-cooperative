import React from 'react';
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

const UserNavbar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
  };
  return (
    <nav className="bg-blue-700 p-4 dark:bg-neutral-900 fixed top-0 w-full z-40">
      <div className="flex items-center">
        {/* Link z nazwą portalu */}
        <Link href="/" className="text-white text-2xl font-bold">
          Portal informacyjny SM Wyrzysk
        </Link>

        {/* Sekcja po prawej stronie */}
        <div className="ml-auto flex items-center space-x-4">
          {/* ThemeToggle */}
          <ThemeToggle />

          {/* Guzik Wyloguj się */}
          <Link href="/">
            <button
                onClick={handleLogout}
                className="text-white bg-blue-600 font-bold hover:bg-blue-800 rounded-3xl p-3 dark:bg-emerald-600 dark:hover:bg-emerald-800"
            >
              Wyloguj się
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
