import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";

// Typ dla mieszkańca
type Resident = {
    tenantId: number;
    pesel: string;
    phoneNumber: string;
    tenantsNumber: number;
    name: string;
    surname: string;
    mail: string;
    isBacklog: boolean;
};

const ManageInhabitantsContent = () => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [selectedResidents, setSelectedResidents] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingResident, setEditingResident] = useState<Resident | null>(null); // Stan edycji mieszkańca

    // Pobieranie danych z API
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

    const handleResidentClick = (resident: Resident) => {
        setEditingResident(resident); // Otwórz okno edycji
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingResident) {
            setEditingResident({ ...editingResident, [e.target.name]: e.target.value });
        }
    };

    const handleSaveEdit = async () => {
        if (!editingResident) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/admin/tenants/${editingResident.tenantId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editingResident),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Zaktualizuj mieszkańca w stanie lokalnym
            setResidents((prev) =>
                prev.map((resident) =>
                    resident.tenantId === editingResident.tenantId ? editingResident : resident
                )
            );
            setEditingResident(null); // Zamknij okno edycji
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd podczas zapisywania danych.");
        }
    };

    const handleDeleteSelected = () => {
        setResidents((prev) => prev.filter((resident) => !selectedResidents.includes(resident.tenantId)));
        setSelectedResidents([]);
    };

    const filteredResidents = residents.filter((resident) =>
        resident.pesel.includes(searchTerm)
    );

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
                            <table className="w-full dark:text-white bg-white text-neutral-800 dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-center px-4 py-2 border-b-2">Zaznacz</th>
                                        <th className="text-center px-4 py-2 border-b-2">PESEL</th>
                                        <th className="text-center px-4 py-2 border-b-2">Imię</th>
                                        <th className="text-center px-4 py-2 border-b-2">Nazwisko</th>
                                        <th className="text-center px-4 py-2 border-b-2">Nr telefonu</th>
                                        <th className="text-center px-4 py-2 border-b-2">Email</th>
                                        <th className="text-center px-4 py-2 border-b-2">Ilość mieszkańców</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResidents.map((resident) => (
                                        <tr
                                            key={resident.tenantId}
                                            className="border-b cursor-pointer"
                                            onClick={() => handleResidentClick(resident)}
                                        >
                                            <td className="text-center px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedResidents.includes(resident.tenantId)}
                                                    onChange={(e) => {
                                                        e.stopPropagation(); // Zapobiegaj propagacji kliknięcia
                                                        handleCheckboxChange(resident.tenantId);
                                                    }}
                                                />
                                            </td>
                                            <td className="text-center px-4 py-2">{resident.pesel}</td>
                                            <td className="text-center px-4 py-2">{resident.name}</td>
                                            <td className="text-center px-4 py-2">{resident.surname}</td>
                                            <td className="text-center px-4 py-2">{resident.phoneNumber}</td>
                                            <td className="text-center px-4 py-2">{resident.mail}</td>
                                            <td className="text-center px-4 py-2">{resident.tenantsNumber}</td>
                                            <td className="text-center px-4 py-2">{resident.isBacklog}</td>

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

                {/* Modal edycji */}
                {editingResident && (
                    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center text-neutral-800">
                        <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-lg w-96">
                            <h2 className="text-2xl font-bold mb-4 dark:text-white">Edytuj mieszkańca</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={editingResident.name}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-2 border rounded-lg text-neutral-800 dark:bg-neutral-700 dark:text-white "
                                    placeholder="Imię"
                                />
                                <input
                                    type="text"
                                    name="surname"
                                    value={editingResident.surname}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-2 border rounded-lg text-neutral-800 dark:bg-neutral-700 dark:text-white" 
                                    placeholder="Nazwisko"
                                />
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={editingResident.phoneNumber}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-2 border rounded-lg text-neutral-800 dark:bg-neutral-700 dark:text-white"
                                    placeholder="Nr telefonu"
                                />
                                <input
                                    type="email"
                                    name="mail"
                                    value={editingResident.mail}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-2 border rounded-lg text-neutral-800 dark:bg-neutral-700 dark:text-white"
                                    placeholder="Email"
                                />
                                <input
                                    type="number"
                                    name="tenantsNumber"
                                    value={editingResident.tenantsNumber}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-2 border rounded-lg text-neutral-800 dark:bg-neutral-700 dark:text-white"
                                    placeholder="Ilość mieszkańców"
                                />
                            </div>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    onClick={() => setEditingResident(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Anuluj
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="bg-blue-600 dark:bg-emerald-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Zapisz
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManageInhabitantsContent;
