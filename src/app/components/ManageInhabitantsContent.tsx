import React, { useState } from "react";
import BackButton from "./BackButton";

type Resident = {
    id: number;
    pesel: string;
    nrTelefonu: string;
    nrMieszkania: number;
    imie: string;
    nazwisko: string;
    iloscMieszkancow: number;
    mail: string;
};

const ManageInhabitantsContent = () => {
    const [residents, setResidents] = useState<Resident[]>([
        {
            id: 1,
            pesel: "12345678901",
            nrTelefonu: "123456789",
            nrMieszkania: 101,
            imie: "Jan",
            nazwisko: "Kowalski",
            iloscMieszkancow: 3,
            mail: "jan.kowalski@example.com",
        },
        {
            id: 2,
            pesel: "09876543210",
            nrTelefonu: "987654321",
            nrMieszkania: 102,
            imie: "Anna",
            nazwisko: "Nowak",
            iloscMieszkancow: 2,
            mail: "anna.nowak@example.com",
        },
    ]);

    const [selectedResidents, setSelectedResidents] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingResident, setEditingResident] = useState<Resident | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleCheckboxChange = (id: number) => {
        setSelectedResidents((prev) =>
            prev.includes(id) ? prev.filter((residentId) => residentId !== id) : [...prev, id]
        );
    };

    const filteredResidents = residents.filter((resident) =>
        resident.pesel.includes(searchTerm)
    );

    const handleDeleteSelected = () => {
        setResidents((prev) => prev.filter((resident) => !selectedResidents.includes(resident.id)));
        setSelectedResidents([]);
    };

    const handleEdit = (resident: Resident) => {
        setIsEditing(true);
        setEditingResident(resident);
    };

    const handleSaveEdit = (updatedResident: Resident) => {
        setResidents((prev) =>
            prev.map((resident) => (resident.id === updatedResident.id ? updatedResident : resident))
        );
        setIsEditing(false);
        setEditingResident(null);
    };

    const handleAddNewResident = (newResident: Resident) => {
        setResidents((prev) => [...prev, { ...newResident, id: prev.length + 1 }]);
        setIsAdding(false);
    };

    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
            <BackButton />
            <main className="flex-grow flex flex-col p-8">
                {/* Wyszukiwanie */}
                <div>
                    <label htmlFor="search" className="block text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                        Wyszukaj użytkowników po PESEL:
                    </label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 mt-2 rounded-lg dark:bg-neutral-700 dark:text-white"
                        placeholder="Wpisz PESEL"
                    />
                </div>

                {/* Lista mieszkańców */}
                <div className="mt-6">
                    <label className="block text-2xl font-semibold text-gray-800 dark:text-white mb-4">Mieszkańcy:</label>
                    <div className="overflow-x-auto text-black dark:text-white">
                        <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Zaznacz</th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">PESEL</th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Imię</th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Nazwisko</th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Nr mieszkania</th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Nr telefonu</th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Email</th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Ilość mieszkańców</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResidents.map((resident) => (
                                    <tr key={resident.id} className="border-b border-gray-200 dark:border-neutral-600">
                                        <td className="text-center px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedResidents.includes(resident.id)}
                                                onChange={() => handleCheckboxChange(resident.id)}
                                            />
                                        </td>
                                        <td className="text-center px-4 py-2">{resident.pesel}</td>
                                        <td
                                            onClick={() => handleEdit(resident)}
                                            className="cursor-pointer text-blue-600 text-center px-4 py-2"
                                        >
                                            {resident.imie}
                                        </td>
                                        <td className="text-center px-4 py-2">{resident.nazwisko}</td>
                                        <td className="text-center px-4 py-2">{resident.nrMieszkania}</td>
                                        <td className="text-center px-4 py-2">{resident.nrTelefonu}</td>
                                        <td className="text-center px-4 py-2">{resident.mail}</td>
                                        <td className="text-center px-4 py-2">{resident.iloscMieszkancow}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>

                {/* Zarządzanie */}
                <div className="mt-6 flex justify-between">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Dodaj mieszkańca
                    </button>
                    <button
                        onClick={handleDeleteSelected}
                        disabled={selectedResidents.length === 0}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Usuń zaznaczonych
                    </button>
                </div>
            </main>

            {/* Modal edycji */}
            {isEditing && (
                <Modal>
                    <ResidentForm
                        resident={editingResident}
                        onSave={handleSaveEdit}
                        onCancel={() => setIsEditing(false)}
                    />
                </Modal>
            )}

            {/* Modal dodawania */}
            {isAdding && (
                <Modal>
                    <ResidentForm
                        onSave={handleAddNewResident}
                        onCancel={() => setIsAdding(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

// Formularz mieszkańca
const ResidentForm = ({ resident = {}, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState(resident);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSave(formData);
    };






    //formularz
    return (<>


        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="pesel" className="text-neutral-800 dark:text-white font-semibold">PESEL</label>
                <input
                    id="pesel"
                    className="bg-neutral-200 dark:bg-neutral-700 text-white placeholder:text-neutral-500 p-1 w-full"
                    name="pesel"
                    value={formData.pesel || ""}
                    onChange={handleChange}
                    placeholder="Wprowadź PESEL"
                    required
                />
            </div>

            <div>
                <label htmlFor="nrTelefonu" className="text-neutral-800 dark:text-white font-semibold">Nr telefonu</label>
                <input
                    id="nrTelefonu"
                    className="bg-neutral-200 dark:bg-neutral-700 text-white placeholder:text-neutral-500 p-1 w-full"
                    name="nrTelefonu"
                    value={formData.nrTelefonu || ""}
                    onChange={handleChange}
                    placeholder="Wprowadź nr telefonu"
                    required
                />
            </div>

            <div>
                <label htmlFor="nrMieszkania" className="text-neutral-800 dark:text-white font-semibold">Nr mieszkania</label>
                <input
                    id="nrMieszkania"
                    className="bg-neutral-200 dark:bg-neutral-700 text-white placeholder:text-neutral-500 p-1 w-full"
                    name="nrMieszkania"
                    value={formData.nrMieszkania || ""}
                    onChange={handleChange}
                    placeholder="Wprowadź nr mieszkania"
                    required
                />
            </div>

            <div>
                <label htmlFor="imie" className="text-neutral-800 dark:text-white font-semibold">Imię</label>
                <input
                    id="imie"
                    className="bg-neutral-200 dark:bg-neutral-700 text-white placeholder:text-neutral-500 p-1 w-full"
                    name="imie"
                    value={formData.imie || ""}
                    onChange={handleChange}
                    placeholder="Wprowadź imię"
                    required
                />
            </div>

            <div>
                <label htmlFor="nazwisko" className="text-neutral-800 dark:text-white font-semibold">Nazwisko</label>
                <input
                    id="nazwisko"
                    className="bg-neutral-200 dark:bg-neutral-700 text-white placeholder:text-neutral-500 p-1 w-full"
                    name="nazwisko"
                    value={formData.nazwisko || ""}
                    onChange={handleChange}
                    placeholder="Wprowadź nazwisko"
                    required
                />
            </div>

            <div>
                <label htmlFor="mail" className="text-neutral-800 dark:text-white font-semibold">Email</label>
                <input
                    id="mail"
                    className="bg-neutral-200 dark:bg-neutral-700 text-white placeholder:text-neutral-500 p-1 w-full"
                    name="mail"
                    value={formData.mail || ""}
                    onChange={handleChange}
                    placeholder="Wprowadź email"
                    required
                />
            </div>

            <div>
                <label htmlFor="iloscMieszkancow" className="text-neutral-800 dark:text-white font-semibold">Ilość mieszkańców</label>
                <input
                    id="iloscMieszkancow"
                    className="bg-neutral-200 dark:bg-neutral-700 text-white placeholder:text-neutral-500 p-1 w-full"
                    name="iloscMieszkancow"
                    value={formData.iloscMieszkancow || ""}
                    onChange={handleChange}
                    placeholder="Wprowadź ilość mieszkańców"
                    required
                />
            </div>

            <div className="flex justify-end space-x-4">
                <button type="submit" className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                    Zapisz
                </button>
                <button onClick={onCancel} type="button" className="bg-neutral-600 text-white px-4 py-2 rounded-lg">
                    Anuluj
                </button>
            </div>
        </form>

    </>
    );
};

// Modal
const Modal = ({ children }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg dark:bg-neutral-900 dark:text-white ">{children}</div>
    </div>
);

export default ManageInhabitantsContent;
