import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";

type Resident = {
    tenantId: number;
    pesel: string;
    phoneNumber: string;
    tenantsNumber: number;
    name: string;
    surname: string;
    mail: string;
    flatNumber: number;
    staircaseNumber: number;
    blockNumber: number;
    street: string;
    city: string;
};

const ManageInhabitantsContent = () => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [selectedResidents, setSelectedResidents] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResidents = async () => {
        try {
            const token = localStorage.getItem("token");
            setIsLoading(true);
            const response = await fetch("http://localhost:8080/api/admin/tenants", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setResidents(data.content);
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd podczas ładowania danych.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    const handleCheckboxChange = (id: number) => {
        setSelectedResidents((prev) =>
            prev.includes(id) ? prev.filter((residentId) => residentId !== id) : [...prev, id]
        );
    };

    const filteredResidents = residents.filter((resident) =>
        resident.pesel.includes(searchTerm)
    );

    const handleDeleteSelected = () => {
        setResidents((prev) => prev.filter((resident) => !selectedResidents.includes(resident.tenantId)));
        setSelectedResidents([]);
    };

    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
            <BackButton />
            <main className="flex-grow flex flex-col p-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Zarządzanie mieszkańcami</h1>

                {/* Wyszukiwanie */}
                <div>
                    <label htmlFor="search" className="block text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        Wyszukaj użytkowników po PESEL:
                    </label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg dark:bg-neutral-700 dark:text-white"
                        placeholder="Wpisz PESEL"
                    />
                </div>

                {/* Ładowanie / Błąd */}
                {isLoading && <p className="text-gray-600 dark:text-gray-300 mt-4">Ładowanie...</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}

                {/* Lista mieszkańców */}
                {!isLoading && !error && (
                    <div className="mt-6">
                        <label className="block text-2xl font-semibold text-gray-800 dark:text-white mb-4">Mieszkańcy:</label>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white dark:text-white text-neutral-800 dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                <thead>
                                <tr>
                                    <th className="text-center px-4 py-2 border-b-2">Zaznacz</th>
                                    <th className="text-center px-4 py-2 border-b-2">PESEL</th>
                                    <th className="text-center px-4 py-2 border-b-2">Imię</th>
                                    <th className="text-center px-4 py-2 border-b-2">Nazwisko</th>
                                    <th className="text-center px-4 py-2 border-b-2">Nr telefonu</th>
                                    <th className="text-center px-4 py-2 border-b-2">Email</th>
                                    <th className="text-center px-4 py-2 border-b-2">Ilość mieszkańców</th>
                                    <th className="text-center px-4 py-2 border-b-2">Nr mieszkania</th>
                                    <th className="text-center px-4 py-2 border-b-2">Klatka schodowa</th>
                                    <th className="text-center px-4 py-2 border-b-2">Numer bloku</th>
                                    <th className="text-center px-4 py-2 border-b-2">Ulica</th>
                                    <th className="text-center px-4 py-2 border-b-2">Miasto</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredResidents.map((resident) => (
                                    <tr key={resident.tenantId} className="border-b">
                                        <td className="text-center px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedResidents.includes(resident.tenantId)}
                                                onChange={() => handleCheckboxChange(resident.tenantId)}
                                            />
                                        </td>
                                        <td className="text-center px-4 py-2">{resident.pesel}</td>
                                        <td className="text-center px-4 py-2">{resident.name}</td>
                                        <td className="text-center px-4 py-2">{resident.surname}</td>
                                        <td className="text-center px-4 py-2">{resident.phoneNumber}</td>
                                        <td className="text-center px-4 py-2">{resident.mail}</td>
                                        <td className="text-center px-4 py-2">{resident.tenantsNumber}</td>
                                        <td className="text-center px-4 py-2">{resident.flatNumber}</td>
                                        <td className="text-center px-4 py-2">{resident.staircaseNumber}</td>
                                        <td className="text-center px-4 py-2">{resident.blockNumber}</td>
                                        <td className="text-center px-4 py-2">{resident.street}</td>
                                        <td className="text-center px-4 py-2">{resident.city}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Zarządzanie */}
                <div className="mt-6 flex justify-between">
                    <button
                        onClick={handleDeleteSelected}
                        disabled={selectedResidents.length === 0}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Usuń zaznaczonych
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ManageInhabitantsContent;
