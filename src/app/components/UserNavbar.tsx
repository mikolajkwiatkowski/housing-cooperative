import React from 'react';
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

const UserNavbar: React.FC = () => {
  return (
    <nav className="bg-blue-700 p-4 dark:bg-neutral-900 fixed top-0 w-full z-50">
      <div className="flex items-center">
        <div className="absolute left-4">
          <ThemeToggle />
        </div>

        <Link href="/" className="text-white text-2xl font-bold pl-52">
          Portal infomacyjny SM Wyrzysk
        </Link>

        <div className="ml-auto">
          <Link
            href="/login_panel"
            className="text-white bg-blue-600 font-bold hover:bg-blue-800 rounded-3xl p-3 dark:bg-emerald-600 dark:hover:bg-emerald-800"
          >
            Zaloguj się
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
