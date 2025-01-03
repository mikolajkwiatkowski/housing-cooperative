import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import 'tailwindcss/tailwind.css';

type Block = {
    blockId: number;
    city: string;
    street: string;
    buildingNumber: number;
};

type ApartmentStaircase = {
    apartmentStaircaseId: number;
    sharedSurface: number;
    staircaseNumber: number;
    block: Block;
};

type Flat = {
    flatId: number;
    flatNumber: number;
    surface: number;
    apartmentStaircase: ApartmentStaircase;
};

type Tenant = {
    tenantId: number;
    name: string;
    surname: string;
    pesel: string;
    phoneNumber: string;
    mail: string;
};

const ManageCooperativeContent = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
    const [staircases, setStaircases] = useState<ApartmentStaircase[]>([]);
    const [selectedStaircase, setSelectedStaircase] = useState<ApartmentStaircase | null>(null);
    const [flats, setFlats] = useState<Flat[]>([]);
    const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<Block | ApartmentStaircase | Flat | null>(null);
    const [newBlock, setNewBlock] = useState<Block | null>(null);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const fetchBlocks = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/admin/blocks", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setBlocks(data.content || []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Wystąpił błąd podczas ładowania danych.");
            } else {
                setError("Wystąpił błąd podczas ładowania danych.");
            }
        }
    };
    const handleAddBlock = async () => {
        try {
            if (!newBlock) return;
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/admin/blocks", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newBlock),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const addedBlock = await response.json();
            setBlocks([...blocks, addedBlock]); // Dodaj nowy blok do listy
            setShowAddModal(false); // Zamknij modal
            setNewBlock(null); // Zresetuj formularz
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Wystąpił błąd podczas dodawania bloku.");
            } else {
                setError("Wystąpił błąd podczas dodawania bloku.");
            }
        }
    };

    useEffect(() => {
        fetchBlocks();
    }, []);
    const fetchStaircases = async (blockId: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/admin/apartment_staircases/block/${blockId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setStaircases(data.content || []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Wystąpił błąd podczas ładowania klatek.");
            } else {
                setError("Wystąpił błąd podczas ładowania klatek.");
            }
        }
    };

    const fetchFlats = async (staircaseId: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/admin/flats/getByStaircaseId/${staircaseId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setFlats(data.content || []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Wystąpił błąd podczas ładowania mieszkań.");
            } else {
                setError("Wystąpił błąd podczas ładowania mieszkań.");
            }
        }
    };

    const fetchTenants = async (flatId: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/admin/tenants/getTenantByFlatId/${flatId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            // Sprawdź, czy odpowiedź jest OK
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
    
            // Sprawdź, czy odpowiedź nie jest pusta
            const text = await response.text();
            console.log("Received response text:", text);  // Zaloguj odpowiedź przed parsowaniem
    
            if (!text) {
                console.log("No data received for tenants.");
                setTenants([]);  // Jeśli brak danych, ustaw pustą tablicę
                return;
            }
    
            // Parsowanie JSON tylko wtedy, gdy odpowiedź zawiera dane
            const rawData = JSON.parse(text);
            console.log("Received tenants data:", rawData);
    
            // Zakładając, że rawData to tablica lub obiekt, możesz sprawdzić jego zawartość
            const tenantData = rawData ? [{
                tenantId: rawData.tenantId,
                pesel: rawData.pesel,
                name: rawData.name,
                surname: rawData.surname,
                phoneNumber: rawData.phoneNumber,
                mail: rawData.mail,
            }] : [];
    
            setTenants(tenantData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Wystąpił błąd podczas ładowania najemców.");
            } else {
                setError("Wystąpił błąd podczas ładowania najemców.");
            }
        }
    };
    
    

    useEffect(() => {
        fetchBlocks();
    }, []);

    const handleBlockClick = (block: Block) => {
        setSelectedBlock(block);
        setStaircases([]);
        setFlats([]);
        setTenants([]);
        fetchStaircases(block.blockId);
    };

    const handleStaircaseClick = (staircase: ApartmentStaircase) => {
        setSelectedStaircase(staircase);
        setFlats([]);
        setTenants([]);
        fetchFlats(staircase.apartmentStaircaseId);
    };

    const handleFlatClick = (flat: Flat) => {
        setSelectedFlat(flat);
        setTenants([]);
        fetchTenants(flat.flatId);
    };
    const [showAddStaircaseModal, setShowAddStaircaseModal] = useState(false);
    const [newStaircase, setNewStaircase] = useState({
        staircaseNumber: '',
        sharedSurface: '',
    });
    const handleAddStaircaseClick = () => {
        if (selectedBlock) {
            setShowAddStaircaseModal(true);
        }
    };
    const handleAddStaircase = async () => {
        if (!selectedBlock) return; // Upewnij się, że blok jest wybrany

        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/admin/apartment_staircases", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    staircaseNumber: newStaircase.staircaseNumber,
                    sharedSurface: newStaircase.sharedSurface,
                    block: { blockId: selectedBlock.blockId }
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Po dodaniu, zamknij modal i zaktualizuj dane
            setShowAddStaircaseModal(false);
            fetchStaircases(selectedBlock.blockId);  // Odśwież klatki
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Wystąpił błąd podczas dodawania klatki.");
            } else {
                setError("Wystąpił błąd podczas dodawania klatki.");
            }
        }
    };

    const [selectedFlatId, setSelectedFlatId] = useState<number | null>(null);
    const [newTenant, setNewTenant] = useState({
        name: '',
        surname: '',
        pesel: '',
        phoneNumber: '',
        mail: '',
        isBacklog: false,
        tenantsNumber: 1,
    });
    const [showAddTenantModal, setShowAddTenantModal] = useState(false);
    const handleAddTenantClick = (flatId: number) => {
        setSelectedFlatId(flatId); // Ustawiamy ID mieszkania, dla którego dodajemy mieszkańca
        setShowAddTenantModal(true); // Pokazujemy formularz
    };
    const handleAddTenant = async () => {
        if (!selectedFlatId) return; // Upewnij się, że flatId zostało ustawione

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/api/admin/tenants", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newTenant,
                    flatId: selectedFlatId, // Dodajemy flatId
                }),
            });

            if (response.ok) {
                // Jeśli dodano, zaktualizuj dane (np. wstaw mieszkańca do mieszkania)
                setShowAddTenantModal(false);
                setNewTenant({
                    name: '',
                    surname: '',
                    pesel: '',
                    phoneNumber: '',
                    mail: '',
                    isBacklog: false,
                    tenantsNumber: 1,
                });
                // Możesz odświeżyć listę mieszkań, aby odzwierciedlić dodanie nowego mieszkańca
            } else {
                console.error("Błąd dodawania mieszkańca");
            }
        } catch (error) {
            console.error(error);
        }
    };










    const [showAddFlatModal, setShowAddFlatModal] = useState(false);
    const [newFlat, setNewFlat] = useState({
        flatNumber: '',
        surface: '',
    });
    const handleAddFlatClick = () => {
        if (selectedStaircase) {
            setShowAddFlatModal(true);
        }
    };
    const handleAddFlat = async () => {
        if (!selectedStaircase) return; // Upewnij się, że klatka jest wybrana

        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/admin/flats", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flatNumber: newFlat.flatNumber,
                    surface: newFlat.surface,
                    apartmentStaircase: { apartmentStaircaseId: selectedStaircase.apartmentStaircaseId }
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Po dodaniu mieszkania, zamknij modal i odśwież listę mieszkań
            setShowAddFlatModal(false);
            fetchFlats(selectedStaircase.apartmentStaircaseId);  // Odśwież mieszkania
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Wystąpił błąd podczas dodawania mieszkania.");
            } else {
                setError("Wystąpił błąd podczas dodawania mieszkania.");
            }
        }
    };

    const handleEditClick = (item: Block | ApartmentStaircase | Flat) => {
        setEditingItem(item);
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        // Save the edited item
        setShowEditModal(false);
    };

    return (
        <div className="container mx-auto mt-4 ">
            <BackButton />
            <main className="mt-4">
                {error && <p className="text-center text-red-500">{error}</p>}

                {!error && (
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-4 text-neutral-800 dark:text-white">Struktura:</h2>
                        <div className="bg-white shadow rounded-lg p-4 dark:bg-neutral-900 mb-10">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
                                onClick={() => setShowAddModal(true)}
                            >
                                Dodaj blok
                            </button>                            <ul className="space-y-4">
                                {blocks.map((block) => (
                                    <li key={block.blockId} className="mb-2">
                                        <div className="flex items-center">
                                            <button onClick={() => handleBlockClick(block)} className="mr-2 text-blue-500 dark:text-cyan-500">▶</button>
                                            <div className="font-bold text-lg text-blue-600 dark:text-cyan-500  cursor-pointer" onClick={() => handleEditClick(block)}>
                                                {block.city}, {block.street} {block.buildingNumber}
                                            </div>
                                            <button className="ml-2 bg-red-500 text-white px-2 py-1 rounded-lg">Usuń</button>
                                        </div>
                                        {selectedBlock && selectedBlock.blockId === block.blockId && (
                                            <div className="ml-4 border-l-2 border-gray-200  pl-4">
                                                <button onClick={handleAddStaircaseClick} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">
                                                    Dodaj klatkę
                                                </button>
                                                <ul className="space-y-2 mt-2">
                                                    {staircases.map((staircase) => (
                                                        <li key={staircase.apartmentStaircaseId} className="mb-2">
                                                            <div className="flex items-center">
                                                                <button onClick={() => handleStaircaseClick(staircase)} className="mr-2 text-green-600">▶</button>
                                                                <div className="font-semibold text-md text-green-600 cursor-pointer" onClick={() => handleEditClick(staircase)}>
                                                                    Klatka {staircase.staircaseNumber} (Powierzchnia wspólna: {staircase.sharedSurface})
                                                                </div>
                                                                <button className="ml-2 bg-red-500 text-white px-2 py-1 rounded-lg">Usuń</button>
                                                            </div>
                                                            {selectedStaircase && selectedStaircase.apartmentStaircaseId === staircase.apartmentStaircaseId && (
                                                                <div className="ml-4 border-l-2 border-gray-200 pl-4">
                                                                    <button onClick={handleAddFlatClick} className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">
                                                                        Dodaj mieszkanie
                                                                    </button>
                                                                    <ul className="space-y-1 mt-2">
                                                                        {flats.map((flat) => (
                                                                            <li key={flat.flatId} className="mb-2">
                                                                                <div className="flex items-center">
                                                                                    <button onClick={() => handleFlatClick(flat)} className="mr-2 text-neutral-700 dark:text-yellow-400">▶</button>
                                                                                    <div className="text-sm text-gray-700 dark:text-yellow-400 cursor-pointer" onClick={() => handleEditClick(flat)}>
                                                                                        Mieszkanie {flat.flatNumber} (Powierzchnia: {flat.surface})
                                                                                    </div>
                                                                                    <button className="ml-2 bg-red-500 text-white px-2 py-1 rounded-lg">Usuń</button>
                                                                                </div>

                                                                                {selectedFlat && selectedFlat.flatId === flat.flatId && (
                                                                                    <div className="ml-4 border-l-2 border-gray-200 pl-4">
                                                                                        {/* Sprawdzamy, czy istnieją jacyś najemcy powiązani z tym mieszkaniem */}
                                                                                        {tenants.length > 0 ? (
                                                                                            <ul className="space-y-1 mt-2 ml-4">
                                                                                                {tenants.map((tenant) => (
                                                                                                    <li key={tenant.tenantId} className="text-sm text-gray-700 dark:text-white font-bold">
                                                                                                        {tenant.name} {tenant.surname} ({tenant.pesel})
                                                                                                        (Tel: {tenant.phoneNumber}, Email: {tenant.mail})
                                                                                                    </li>
                                                                                                ))}
                                                                                            </ul>
                                                                                        ) : (
                                                                                            <div className="text-sm text-gray-700 dark:text-white font-bold">
                                                                                                Brak przypisanego mieszkańca
                                                                                            </div>
                                                                                        )}

                                                                                        {/* Przycisk do dodania mieszkańca */}
                                                                                        <button
                                                                                            onClick={() => handleAddTenantClick(flat.flatId)}
                                                                                            className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
                                                                                        >
                                                                                            Dodaj mieszkańca
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </li>
                                                                        ))}


                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </main>
            {showAddTenantModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-neutral-800">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Dodaj mieszkańca</h2>
                        <div className="space-y-4">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Imię:
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={newTenant.name}
                                    onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Imię"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nazwisko:
                                </label>
                                <input
                                    type="text"
                                    id="surname"
                                    value={newTenant.surname}
                                    onChange={(e) => setNewTenant({ ...newTenant, surname: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Nazwisko"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="pesel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    PESEL:
                                </label>
                                <input
                                    type="text"
                                    id="pesel"
                                    value={newTenant.pesel}
                                    onChange={(e) => setNewTenant({ ...newTenant, pesel: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="PESEL"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Numer telefonu:
                                </label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    value={newTenant.phoneNumber}
                                    onChange={(e) => setNewTenant({ ...newTenant, phoneNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Numer telefonu"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="mail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    id="mail"
                                    value={newTenant.mail}
                                    onChange={(e) => setNewTenant({ ...newTenant, mail: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Email"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="isBacklog" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Czy zaległy?
                                </label>
                                <input
                                    type="checkbox"
                                    id="isBacklog"
                                    checked={newTenant.isBacklog}
                                    onChange={(e) => setNewTenant({ ...newTenant, isBacklog: e.target.checked })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={() => setShowAddTenantModal(false)} className="bg-neutral-500 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg">Anuluj</button>
                            <button onClick={handleAddTenant} className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg">Zapisz</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddFlatModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-neutral-800">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Dodaj mieszkanie</h2>
                        <div className="space-y-4">
                            <div className="mb-4">
                                <label htmlFor="flatNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Numer mieszkania:
                                </label>
                                <input
                                    type="text"
                                    id="flatNumber"
                                    value={newFlat.flatNumber}
                                    onChange={(e) => setNewFlat({ ...newFlat, flatNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Numer mieszkania"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="surface" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Powierzchnia:
                                </label>
                                <input
                                    type="number"
                                    id="surface"
                                    value={newFlat.surface}
                                    onChange={(e) => setNewFlat({ ...newFlat, surface: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Powierzchnia mieszkania"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={() => setShowAddFlatModal(false)} className=" bg-neutral-500 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg">Anuluj</button>
                            <button onClick={handleAddFlat} className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg">Zapisz</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddStaircaseModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-neutral-800">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Dodaj klatkę</h2>
                        <div className="space-y-4">
                            <div className="mb-4">
                                <label htmlFor="staircaseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Numer klatki:
                                </label>
                                <input
                                    type="number"
                                    id="staircaseNumber"
                                    value={newStaircase.staircaseNumber}
                                    onChange={(e) => setNewStaircase({ ...newStaircase, staircaseNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Numer klatki"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="sharedSurface" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Powierzchnia wspólna:
                                </label>
                                <input
                                    type="number"
                                    id="sharedSurface"
                                    value={newStaircase.sharedSurface}
                                    onChange={(e) => setNewStaircase({ ...newStaircase, sharedSurface: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Powierzchnia wspólna"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={() => setShowAddStaircaseModal(false)} className=" bg-neutral-500 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg">Anuluj</button>
                            <button onClick={handleAddStaircase} className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg">Zapisz</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-neutral-800">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Dodaj blok</h2>
                        <div className="space-y-4">
                            <div className="mb-4">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Miasto:
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={newBlock?.city || ""}
                                    onChange={(e) => setNewBlock({ ...newBlock, city: e.target.value } as Block)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Miasto"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Ulica:
                                </label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={newBlock?.street || ""}
                                    onChange={(e) => setNewBlock({ ...newBlock, street: e.target.value } as Block)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Ulica"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="buildingNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Numer budynku:
                                </label>
                                <input
                                    type="number"
                                    id="buildingNumber"
                                    name="buildingNumber"
                                    value={newBlock?.buildingNumber || ""}
                                    onChange={(e) => setNewBlock({ ...newBlock, buildingNumber: parseInt(e.target.value) } as Block)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Numer budynku"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-neutral-500 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={handleAddBlock}
                                className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                            >
                                Dodaj
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && editingItem && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-neutral-800">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Edytuj</h2>
                        <div className="space-y-4">

                            {editingItem && 'city' in editingItem && (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Miasto:
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={editingItem.city}
                                            onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                            placeholder="Miasto"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Ulica:
                                        </label>
                                        <input
                                            type="text"
                                            id="street"
                                            name="street"
                                            value={editingItem.street}
                                            onChange={(e) => setEditingItem({ ...editingItem, street: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                            placeholder="Ulica"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="buildingNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Numer budynku:
                                        </label>
                                        <input
                                            type="number"
                                            id="buildingNumber"
                                            name="buildingNumber"
                                            value={editingItem.buildingNumber}
                                            onChange={(e) => setEditingItem({ ...editingItem, buildingNumber: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                            placeholder="Numer budynku"
                                        />
                                    </div>
                                </>
                            )}

                            {editingItem && 'staircaseNumber' in editingItem && (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="staircaseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Numer klatki:
                                        </label>
                                        <input
                                            type="number"
                                            id="staircaseNumber"
                                            name="staircaseNumber"
                                            value={editingItem.staircaseNumber}
                                            onChange={(e) => setEditingItem({ ...editingItem, staircaseNumber: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                            placeholder="Numer klatki"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="sharedSurface" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Powierzchnia wspólna:
                                        </label>
                                        <input
                                            type="number"
                                            id="sharedSurface"
                                            name="sharedSurface"
                                            value={editingItem.sharedSurface}
                                            onChange={(e) => setEditingItem({ ...editingItem, sharedSurface: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                            placeholder="Powierzchnia wspólna"
                                        />
                                    </div>
                                </>
                            )}

                            {editingItem && 'flatNumber' in editingItem && (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="flatNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Numer mieszkania:
                                        </label>
                                        <input
                                            type="number"
                                            id="flatNumber"
                                            name="flatNumber"
                                            value={editingItem.flatNumber}
                                            onChange={(e) => setEditingItem({ ...editingItem, flatNumber: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                            placeholder="Numer mieszkania"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="surface" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Powierzchnia:
                                        </label>
                                        <input
                                            type="number"
                                            id="surface"
                                            name="surface"
                                            value={editingItem.surface}
                                            onChange={(e) => setEditingItem({ ...editingItem, surface: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                            placeholder="Powierzchnia"
                                        />
                                    </div>
                                </>
                            )}


                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={() => setShowEditModal(false)} className=" bg-neutral-500 dark:bg-neutral-700  text-white px-4 py-2 rounded-lg">Anuluj</button>
                            <button onClick={handleSaveEdit} className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg">Zapisz</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCooperativeContent;