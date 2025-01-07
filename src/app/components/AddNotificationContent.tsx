"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import BackButton from "./BackButton";

type Props = {};

const AddNotificationContent = (props: Props) => {
  // Przykładowa lista mieszkańców
  const [residents, setResidents] = useState([
    { id: 1, name: "Jan Kowalski", email: "jan.kowalski@example.com" },
    { id: 2, name: "Anna Nowak", email: "anna.nowak@example.com" },
    { id: 3, name: "Piotr Wiśniewski", email: "piotr.wisniewski@example.com" },
  ]);

  // Przechowywanie zaznaczonych odbiorców
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);

  // Pole wyszukiwania
  const [searchTerm, setSearchTerm] = useState("");

  // Obsługa zaznaczania
  const handleCheckboxChange = (id: number) => {
    setSelectedRecipients((prev) =>
      prev.includes(id)
        ? prev.filter((recipientId) => recipientId !== id) // Usuń zaznaczenie
        : [...prev, id] // Dodaj zaznaczenie
    );
  };

  // Filtrowanie listy mieszkańców na podstawie wyszukiwania
  const filteredResidents = residents.filter((resident) =>
    resident.id.toString().includes(searchTerm)
  );

  return (
    <div id="main-container" className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
      <BackButton/>
      <main className="flex-grow flex flex-col p-8">
        <form className="flex flex-col space-y-6 w-full">
          {/* Pole wyszukiwania */}
          <div>
            <label htmlFor="search" className="block text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              Wyszukaj użytkowników po ID:
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 mt-2 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Wpisz ID użytkownika"
            />
          </div>

          {/* Tabela odbiorców */}
          <div>
            <label className="block text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Odbiorcy:
            </label>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2 text-gray-800 dark:text-white">Zaznacz</th>
                    <th className="text-left px-4 py-2 text-gray-800 dark:text-white">ID</th>
                    <th className="text-left px-4 py-2 text-gray-800 dark:text-white">Imię i nazwisko</th>
                    <th className="text-left px-4 py-2 text-gray-800 dark:text-white">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResidents.map((resident) => (
                    <tr key={resident.id} className="border-t dark:border-neutral-600">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          className="form-checkbox text-blue-600 dark:text-emerald-500"
                          checked={selectedRecipients.includes(resident.id)}
                          onChange={() => handleCheckboxChange(resident.id)}
                        />
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-white">{resident.id}</td>

                      <td className="px-4 py-2 text-gray-700 dark:text-white">{resident.name}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-white">{resident.email}</td>
                    </tr>
                  ))}
                  {filteredResidents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
                        Nie znaleziono użytkowników
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pole tytułu */}
          <div>
            <label htmlFor="title" className="block text-2xl font-semibold text-gray-800 dark:text-white">
              Tytuł
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-3 mt-2 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Wpisz tytuł"
              required
            />
          </div>

          {/* Pole treści */}
          <div>
            <label htmlFor="content" className="block text-2xl font-semibold text-gray-800 dark:text-white">
              Treść
            </label>
            <textarea
              id="content"
              rows={10}
              className="w-full px-4 py-3 mt-2 text-gray-700 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Wpisz treść powiadomienia"
              required
            />
          </div>

          {/* Przyciski */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 dark:bg-emerald-600 dark:hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg"
            >
              Wyślij
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddNotificationContent;
