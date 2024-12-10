// src/pages/login.tsx
import React from "react";
import ThemeToggle from "../components/ThemeToggle";

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-800 flex justify-center items-center">
      <div className="max-w-md w-full p-8
       bg-gray-200  dark:bg-neutral-900 
       rounded-lg  shadow-lg">
      <div className="fixed top-4 left-4 z-50">
        <ThemeToggle />
      </div>

        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-emerald-600 pb-5 ">Logowanie</h2>

        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-blue-600 dark:text-emerald-600 text-xl font-semibold">Login</label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 mt-2  
              text-neutral-600 rounded-lg 
              focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:text-blue-500
              dark:focus:ring-emerald-500 dark:focus:text-emerald-500 
              dark:bg-neutral-700
              dark:text-neutral-400"
              
              placeholder="Wpisz login"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-blue-600 dark:text-emerald-600 text-xl font-semibold">Hasło</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-2  text-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:text-blue-500
              dark:focus:ring-emerald-500 dark:focus:text-emerald-500
              dark:bg-neutral-700
              dark:text-neutral-400"
              
              placeholder="Wpisz hasło"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2  text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-800 dark:bg-emerald-600 dark:hover:bg-emerald-800 focus:outline-none focus:ring-2 dark:focus:ring-emerald-600 focus:ring-blue-500"
            >
              Zaloguj się
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
