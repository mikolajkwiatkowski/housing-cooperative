"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Importowanie useRouter
import ThemeToggle from "../components/ThemeToggle";

const Page: React.FC = () => {
  const [username, setUsername] = useState(""); // Stan dla username
  const [password, setPassword] = useState(""); // Stan dla password
  const [error, setError] = useState<string | null>(null); // Stan dla błędów
  const router = useRouter(); // Hook do routingu

  // Funkcja obsługująca logowanie
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Zapobieganie przeładowaniu strony

    // Walidacja danych logowania
    if (username === "user" && password === "user") {
      // Jeśli dane poprawne, przekierowanie na panel użytkownika
      router.push("/user_panel");
    }else if (username === "admin" && password === "admin") {
      router.push("/admin_panel");
    }
     else {
      // Jeśli dane niepoprawne, wyświetlenie błędu
      setError("Nieprawidłowy login lub hasło");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-800 flex justify-center items-center">
      <div className="max-w-md w-full p-8 bg-gray-200 dark:bg-neutral-900 rounded-lg shadow-lg">
        <div className="fixed top-4 left-4 z-50">
          <ThemeToggle />
        </div>

        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-emerald-600 pb-5">
          Logowanie
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-blue-600 dark:text-emerald-600 text-xl font-semibold"
            >
              Login
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Przechowywanie loginu
              className="w-full px-4 py-2 mt-2 text-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:text-blue-500 dark:focus:ring-emerald-500 dark:focus:text-emerald-500 dark:bg-neutral-700 dark:text-neutral-400"
              placeholder="Wpisz login"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-blue-600 dark:text-emerald-600 text-xl font-semibold"
            >
              Hasło
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Przechowywanie hasła
              className="w-full px-4 py-2 mt-2 text-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:text-blue-500 dark:focus:ring-emerald-500 dark:focus:text-emerald-500 dark:bg-neutral-700 dark:text-neutral-400"
              placeholder="Wpisz hasło"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>} {/* Wyświetlanie błędu */}

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-800 dark:bg-emerald-600 dark:hover:bg-emerald-800 focus:outline-none focus:ring-2 dark:focus:ring-emerald-600 focus:ring-blue-500"
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
