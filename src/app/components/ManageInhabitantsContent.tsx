"use client";
import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import useAuth from "@/app/useAuth";

// Typ dla mieszkańca
type Resident = {
    tenantId: number;
    pesel: string;
    name: string;
    surname: string;
    phoneNumber: string;
    isBacklog: boolean;
    tenantsNumber: number;
    mail: string;
    blockNumber: number;
    staircaseNumber: number;
    flatNumber: number;
    street: string;
    city: string;
    flatId: number;
};

const ManageInhabitantsContent = () => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [selectedResidents, setSelectedResidents] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingResident, setEditingResident] = useState<Resident | null>(null); // Stan edycji mieszkańca
    const [newResident, setNewResident] = useState<Resident>({
        tenantId: 0,
        pesel: "",
        name: "",
        surname: "",
        phoneNumber: "",
        isBacklog: false,
        tenantsNumber: 0,
        mail: "",
        blockNumber: 0,
        staircaseNumber: 0,
        flatNumber: 0,
        street: "",
        city: "",
        flatId: 0
    }); // Stan dla nowego mieszkańca
    const [showAddModal, setShowAddModal] = useState(false); // Stan kontrolujący widoczność modalu
    const [showEditModal, setShowEditModal] = useState(false); // Stan kontrolujący widoczność modalu edycji

    // Funkcja do pobierania danych mieszkańców
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

    // Funkcja do zmiany wartości w formularzu nowego mieszkańca
    const handleNewResidentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewResident({
            ...newResident,
            [e.target.name]: e.target.value
        });
    };

    // Funkcja do zmiany wartości w formularzu edycji mieszkańca
    const handleEditResidentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        // Aktualizuj stan `editingResident`
        setEditingResident((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: name === "tenantsNumber" ? parseInt(value, 10) || 0 : value,
            };
        });
    };
    

    // Funkcja do zapisywania nowego mieszkańca
    const handleSaveNewResident = async () => {
        // Przygotowanie danych do wysłania
        const tenantData = {
            pesel: newResident.pesel,
            name: newResident.name,
            surname: newResident.surname,
            phoneNumber: newResident.phoneNumber,
            isBacklog: false,
            tenantsNumber: parseInt(String(newResident.tenantsNumber), 10), // Konwersja na liczbę
            mail: newResident.mail,
            flatId: parseInt(String(newResident.flatId), 10), // Konwersja na liczbę
        };

        // Wypisz JSON do konsoli
        console.log("Dane do wysłania:", JSON.stringify(tenantData, null, 2));

        // Wysyłanie żądania do backendu
        try {
            const response = await fetch("http://localhost:8080/api/admin/tenants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(tenantData),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Pobierz szczegóły błędu
                console.error("Błąd dodawania mieszkańca:", errorData);
                throw new Error(errorData.message || "Wystąpił problem podczas dodawania mieszkańca.");
            }

            const result = await response.json();
            console.log("Mieszkaniec dodany:", result);

            setShowAddModal(false); // Zamknij modal po zapisie
        } catch (error) {
            console.error("Błąd:", error);
            alert("Wystąpił błąd podczas dodawania mieszkańca.");
        }
    };


    const handleDeleteResident = async (tenantId: number) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tego mieszkańca?")) return;
    
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/admin/tenants/${tenantId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
    
            // Aktualizuj stan, usuwając mieszkańca z listy
            setResidents((prev) => prev.filter((resident) => resident.tenantId !== tenantId));
            alert("Mieszkaniec został pomyślnie usunięty.");
        } catch (err: any) {
            console.error("Błąd podczas usuwania mieszkańca:", err.message || err);
            alert("Wystąpił błąd podczas usuwania mieszkańca.");
        }
    };
    

    // Funkcja do zapisywania edytowanego mieszkańca
    const handleSaveEditedResident = async () => {
    if (!editingResident) return;

    const tenantData = {
        pesel: editingResident.pesel,
        name: editingResident.name,
        surname: editingResident.surname,
        phoneNumber: editingResident.phoneNumber,
        mail: editingResident.mail,
        tenantsNumber: editingResident.tenantsNumber,
    };

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/admin/tenants/${editingResident.tenantId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tenantData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Błąd podczas edytowania mieszkańca:", errorData);
            throw new Error(errorData.message || "Wystąpił problem podczas edytowania mieszkańca.");
        }

        // Po edycji pobierz ponownie całą listę mieszkańców
        await fetchResidents();

        setShowEditModal(false);
        setEditingResident(null);
    } catch (err: any) {
        console.error("Błąd:", err.message || err);
        alert("Wystąpił błąd podczas edytowania mieszkańca.");
    }
};

    
    

    const handleCheckboxChange = (id: number) => {
        setSelectedResidents((prev) =>
            prev.includes(id) ? prev.filter((residentId) => residentId !== id) : [...prev, id]
        );
    };

    const handleEditClick = (resident: Resident) => {
        setEditingResident(resident);
        setShowEditModal(true);
    };

    const filteredResidents = residents.filter((resident) =>
        resident.name.includes(searchTerm)
    );
    useAuth();
    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
            <BackButton />
            <main className="flex-grow flex flex-col p-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Zarządzanie mieszkańcami</h1>

                {/* Przycisk do dodawania mieszkańca */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4"
                >
                    Dodaj mieszkańca
                </button>

                {/* Wyszukiwanie */}
                <div>
                    <label htmlFor="search" className="block text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        Wyszukaj użytkowników po imieniu:
                    </label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                        placeholder="Wpisz imieniu"
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
                                        <th className="text-center px-4 py-2 border-b-2">Numer mieszkania</th>
                                        <th className="text-center px-4 py-2 border-b-2">Numer klatki</th>
                                        <th className="text-center px-4 py-2 border-b-2">Numer bloku</th>
                                        <th className="text-center px-4 py-2 border-b-2">Ulica</th>
                                        <th className="text-center px-4 py-2 border-b-2">Miasto</th>
                                        <th className="text-center px-4 py-2 border-b-2">Akcja</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResidents.map((resident) => (
                                        <tr
                                            key={resident.tenantId}
                                            className="border-b cursor-pointer"
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
                                            <td className="text-center px-4 py-2">{resident.flatNumber}</td>
                                            <td className="text-center px-4 py-2">{resident.staircaseNumber}</td>
                                            <td className="text-center px-4 py-2">{resident.blockNumber}</td>
                                            <td className="text-center px-4 py-2">{resident.street}</td>
                                            <td className="text-center px-4 py-2">{resident.city}</td>






                                            <td className="text-center px-4 py-2">
                                                <button
                                                    onClick={() => handleEditClick(resident)}
                                                    className="bg-blue-500 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Edytuj
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal dodawania nowego mieszkańca */}
                {showAddModal && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-neutral-800">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Dodaj nowego mieszkańca</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="pesel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        PESEL
                                    </label>
                                    <input
                                        id="pesel"
                                        type="text"
                                        name="pesel"
                                        value={newResident.pesel}
                                        onChange={handleNewResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="PESEL"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Imię
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={newResident.name}
                                        onChange={handleNewResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="Imię"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Nazwisko
                                    </label>
                                    <input
                                        id="surname"
                                        type="text"
                                        name="surname"
                                        value={newResident.surname}
                                        onChange={handleNewResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="Nazwisko"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Nr telefonu
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        type="text"
                                        name="phoneNumber"
                                        value={newResident.phoneNumber}
                                        onChange={handleNewResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="Nr telefonu"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="mail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="mail"
                                        type="email"
                                        name="mail"
                                        value={newResident.mail}
                                        onChange={handleNewResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="Email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tenantsNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Ilość mieszkańców
                                    </label>
                                    <input
                                        id="tenantsNumber"
                                        type="number"
                                        name="tenantsNumber"
                                        value={newResident.tenantsNumber}
                                        onChange={handleNewResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="Ilość mieszkańców"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="flatId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        ID mieszkania
                                    </label>
                                    <input
                                        id="flatId"
                                        type="number"
                                        name="flatId"
                                        value={newResident.flatId}
                                        onChange={handleNewResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="ID mieszkania"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Anuluj
                                </button>
                                <button
                                    onClick={handleSaveNewResident}
                                    className="bg-blue-600 dark:bg-emerald-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Zapisz
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal edytowania mieszkańca */}
                {showEditModal && editingResident && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-neutral-800">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Edytuj mieszkańca</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="editPesel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        PESEL
                                    </label>
                                    <input
                                        id="editPesel"
                                        type="text"
                                        name="pesel"
                                        value={editingResident.pesel}
                                        onChange={handleEditResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="PESEL"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Imię
                                    </label>
                                    <input
                                        id="editName"
                                        type="text"
                                        name="name"
                                        value={editingResident.name}
                                        onChange={handleEditResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="Imię"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editSurname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Nazwisko
                                    </label>
                                    <input
                                        id="editSurname"
                                        type="text"
                                        name="surname"
                                        value={editingResident.surname}
                                        onChange={handleEditResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="Nazwisko"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editPhoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Nr telefonu
                                    </label>
                                    <input
                                        id="editPhoneNumber"
                                        type="text"
                                        name="phoneNumber"
                                        value={editingResident.phoneNumber}
                                        onChange={handleEditResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="Nr telefonu"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editMail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="editMail"
                                        type="email"
                                        name="mail"
                                        value={editingResident.mail}
                                        onChange={handleEditResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="Email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editTenantsNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Ilość mieszkańców
                                    </label>
                                    <input
                                        id="editTenantsNumber"
                                        type="number"
                                        name="tenantsNumber"
                                        value={editingResident.tenantsNumber}
                                        onChange={handleEditResidentChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                        placeholder="Ilość mieszkańców"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Anuluj
                                </button>
                                <button
                                    onClick={() => handleDeleteResident(editingResident.tenantId)}
                                    className="bg-red-600 dark:bg-emerald-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Usuń
                                </button>
                                <button
                                    onClick={handleSaveEditedResident}
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
