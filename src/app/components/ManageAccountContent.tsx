"use client";

import { useState } from "react";
import ManageAccountPage from "../user_panel/manage_account/page";
import BackButton from "./BackButton";

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

    // Walidacja hasła - muszą być takie same i niepuste
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

    const token = localStorage.getItem("token"); // Pobranie tokena z localStorage

    if (!token) {
      setErrorMessage("Brak tokenu autoryzacji. Zaloguj się ponownie.");
      return;
    }

    // Dekodowanie tokena, aby wyciągnąć email
    const decoded = decodeToken(token);
    const email = decoded?.sub; // Wyciąganie emaila z pola "sub"

    if (!email) {
      setErrorMessage("Nie można wyciągnąć adresu e-mail z tokena.");
      return;
    }

    try {
      setIsLoading(true); // Ustawienie stanu ładowania
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
      setIsLoading(false); // Wyłączenie stanu ładowania
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
        <BackButton/>
      <main className="flex-grow p-8 flex justify-center text-neutral-800 dark:text-white">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6">Zmiana hasła</h2>

          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 mb-4">{successMessage}</div>
          )}

          <div className="mb-4">
            <label htmlFor="newPassword" className="block font-medium mb-2">
              Nowe hasło
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-neutral-800 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block font-medium mb-2">
              Potwierdź nowe hasło
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-neutral-800 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full dark:bg-emerald-700 hover:dark:bg-emerald-800 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
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
