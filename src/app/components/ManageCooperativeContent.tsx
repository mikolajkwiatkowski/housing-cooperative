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

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const rawData = await response.json();
            console.log("Received tenants data:", rawData);

            const tenantData = {
                tenantId: rawData.tenantId,
                pesel: rawData.pesel,
                name: rawData.name,
                surname: rawData.surname,
                phoneNumber: rawData.phoneNumber,
                mail: rawData.mail,
            };

            setTenants([tenantData]);
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

    const handleEditClick = (item: Block | ApartmentStaircase | Flat) => {
        setEditingItem(item);
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        // Save the edited item
        setShowEditModal(false);
    };

    return (
        <div className="container mx-auto mt-4">
            <BackButton />
            <main className="mt-4">
                {error && <p className="text-center text-red-500">{error}</p>}

                {!error && (
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-4">Struktura:</h2>
                        <div className="bg-white shadow rounded-lg p-4">
                            <button className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Dodaj blok</button>
                            <ul className="space-y-4">
                                {blocks.map((block) => (
                                    <li key={block.blockId} className="mb-2">
                                        <div className="flex items-center">
                                            <button onClick={() => handleBlockClick(block)} className="mr-2">▶</button>
                                            <div className="font-bold text-lg text-blue-600 cursor-pointer" onClick={() => handleEditClick(block)}>
                                                {block.city}, {block.street} {block.buildingNumber}
                                            </div>
                                            <button className="ml-2 bg-red-500 text-white px-2 py-1 rounded-lg">Usuń</button>
                                        </div>
                                        {selectedBlock && selectedBlock.blockId === block.blockId && (
                                            <div className="ml-4 border-l-2 border-gray-200 pl-4">
                                                <button className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Dodaj klatkę</button>
                                                <ul className="space-y-2 mt-2">
                                                    {staircases.map((staircase) => (
                                                        <li key={staircase.apartmentStaircaseId} className="mb-2">
                                                            <div className="flex items-center">
                                                                <button onClick={() => handleStaircaseClick(staircase)} className="mr-2">▶</button>
                                                                <div className="font-semibold text-md text-green-600 cursor-pointer" onClick={() => handleEditClick(staircase)}>
                                                                    Klatka {staircase.staircaseNumber} (Powierzchnia wspólna: {staircase.sharedSurface})
                                                                </div>
                                                                <button className="ml-2 bg-red-500 text-white px-2 py-1 rounded-lg">Usuń</button>
                                                            </div>
                                                            {selectedStaircase && selectedStaircase.apartmentStaircaseId === staircase.apartmentStaircaseId && (
                                                                <div className="ml-4 border-l-2 border-gray-200 pl-4">
                                                                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4">Dodaj mieszkanie</button>
                                                                    <ul className="space-y-1 mt-2">
                                                                        {flats.map((flat) => (
                                                                            <li key={flat.flatId} className="mb-2">
                                                                                <div className="flex items-center">
                                                                                    <button onClick={() => handleFlatClick(flat)} className="mr-2">▶</button>
                                                                                    <div className="text-sm text-gray-700 cursor-pointer" onClick={() => handleEditClick(flat)}>
                                                                                        Mieszkanie {flat.flatNumber} (Powierzchnia: {flat.surface})
                                                                                    </div>
                                                                                    <button className="ml-2 bg-red-500 text-white px-2 py-1 rounded-lg">Usuń</button>
                                                                                </div>
                                                                                {selectedFlat && selectedFlat.flatId === flat.flatId && (
                                                                                    <ul className="space-y-1 mt-2 ml-4 border-l-2 border-gray-200 pl-4">
                                                                                        {tenants.map((tenant) => (
                                                                                            <li key={tenant.tenantId} className="text-sm text-gray-700">
                                                                                                {tenant.name} {tenant.surname} ({tenant.pesel})
                                                                                                (Tel: {tenant.phoneNumber}, Email: {tenant.mail})
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
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

            {showEditModal && editingItem && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edytuj</h2>
                        <div className="space-y-4">
                            {editingItem && 'city' in editingItem && (
                                <>
                                    <input
                                        type="text"
                                        name="city"
                                        value={editingItem.city}
                                        onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Miasto"
                                    />
                                    <input
                                        type="text"
                                        name="street"
                                        value={editingItem.street}
                                        onChange={(e) => setEditingItem({ ...editingItem, street: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Ulica"
                                    />
                                    <input
                                        type="number"
                                        name="buildingNumber"
                                        value={editingItem.buildingNumber}
                                        onChange={(e) => setEditingItem({ ...editingItem, buildingNumber: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Numer budynku"
                                    />
                                </>
                            )}
                            {editingItem && 'staircaseNumber' in editingItem && (
                                <>
                                    <input
                                        type="number"
                                        name="staircaseNumber"
                                        value={editingItem.staircaseNumber}
                                        onChange={(e) => setEditingItem({ ...editingItem, staircaseNumber: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Numer klatki"
                                    />
                                    <input
                                        type="number"
                                        name="sharedSurface"
                                        value={editingItem.sharedSurface}
                                        onChange={(e) => setEditingItem({ ...editingItem, sharedSurface: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Powierzchnia wspólna"
                                    />
                                </>
                            )}
                            {editingItem && 'flatNumber' in editingItem && (
                                <>
                                    <input
                                        type="number"
                                        name="flatNumber"
                                        value={editingItem.flatNumber}
                                        onChange={(e) => setEditingItem({ ...editingItem, flatNumber: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Numer mieszkania"
                                    />
                                    <input
                                        type="number"
                                        name="surface"
                                        value={editingItem.surface}
                                        onChange={(e) => setEditingItem({ ...editingItem, surface: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Powierzchnia"
                                    />
                                </>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={() => setShowEditModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Anuluj</button>
                            <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Zapisz</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCooperativeContent;