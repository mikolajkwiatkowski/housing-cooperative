
"use client";

import { useState } from "react";
import BackButton from "./BackButton";
import useAuth from "@/app/useAuth";

// Funkcja do dekodowania tokena JWT
const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) throw new Error("Invalid token format");
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

const ManageAccountContent: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Walidacja hasła
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Hasła nie mogą być puste.");
      setSuccessMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Hasła muszą być takie same.");
      setSuccessMessage("");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Brak tokenu autoryzacji. Zaloguj się ponownie.");
      return;
    }

    const decoded = decodeToken(token);
    const email = decoded?.sub;

    if (!email) {
      setErrorMessage("Nie można wyciągnąć adresu e-mail z tokena.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/api/user/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        setSuccessMessage("Hasło zostało zmienione pomyślnie.");
        setErrorMessage("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.text();
        setErrorMessage(`Błąd: ${errorData}`);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Wystąpił błąd podczas zmiany hasła.");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };
  useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-neutral-800">
      {/* Guzik nawigacyjny */}
      <div className="p-4">
        <BackButton />
      </div>

      {/* Treść strony */}
      <main className="flex justify-center items-center p-4 mt-[-30px] h-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md w-full max-w-xs max-h-[300px]"
        >
          <h2 className="text-lg font-semibold mb-3 text-center">Zmiana hasła</h2>

          {errorMessage && (
            <div className="text-red-500 mb-2 text-sm">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 mb-2 text-sm">{successMessage}</div>
          )}

          <div className="mb-2">
            <label htmlFor="newPassword" className="block font-medium mb-1">
              Nowe hasło
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-1.5 border rounded-lg dark:bg-neutral-800 dark:text-white text-sm"
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="confirmPassword" className="block font-medium mb-1">
              Potwierdź nowe hasło
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-1.5 border rounded-lg dark:bg-neutral-800 dark:text-white text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full dark:bg-emerald-700 hover:dark:bg-emerald-800 bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Przetwarzanie..." : "Zmień hasło"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ManageAccountContent;
