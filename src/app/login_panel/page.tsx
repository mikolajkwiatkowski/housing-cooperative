"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import ThemeToggle from "../components/ThemeToggle";

const Page: React.FC = () => {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState<string | null>(null); // State for errors
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message
  const router = useRouter(); // Hook for routing

  // Function to handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await fetch("http://localhost:8080/api/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Save the session token in localStorage
        setSuccessMessage("Login successful!"); // Set success message
        setError(null); // Clear any previous errors

        console.log(data.token);

        // Fetch the user role using the new endpoint
        const roleResponse = await fetch("http://localhost:8080/api/user/role", {
          method: "GET",
          headers: {
            Authorization: `Bearer ` + data.token,
          },
        });

        if (roleResponse.ok) {
          const roleData = await roleResponse.json();

          // Redirect based on user role
          if (roleData.role === "USER") {
            router.push("/user_panel");
          } else {
            router.push("/admin_panel");
          }
        } else {
          setError("Niepoprawne dane logowania!");
          setSuccessMessage(null); // Clear any previous success message
        }
      } else {
        const errorData = await response.json();
        setError(`Login failed: ${errorData.message || response.statusText}`);
        setSuccessMessage(null); // Clear any previous success message
      }
    } catch (error) {
      // @ts-ignore
      setError(`An error occurred during login: ${error.message}`);
      setSuccessMessage(null); // Clear any previous success message
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-800 flex justify-center items-center relative">
      {/* Theme Toggle in the top-right corner */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Login form */}
      <div className="max-w-md w-full p-8 bg-gray-200 dark:bg-neutral-900 rounded-lg shadow-lg">
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
              onChange={(e) => setUsername(e.target.value)} // Store username
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
              onChange={(e) => setPassword(e.target.value)} // Store password
              className="w-full px-4 py-2 mt-2 text-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:text-blue-500 dark:focus:ring-emerald-500 dark:focus:text-emerald-500 dark:bg-neutral-700 dark:text-neutral-400"
              placeholder="Wpisz hasło"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error */}
          {successMessage && (
            <p className="text-green-500 text-center">{successMessage}</p>
          )} {/* Display success message */}

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
