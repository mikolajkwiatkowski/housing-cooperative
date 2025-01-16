"use client";
import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import 'tailwindcss/tailwind.css';
import useAuth from "@/app/useAuth";


type Item = {
    id: number;
    name: string;
    // Dodaj inne pola w zależności od potrzeb
};

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
    flat: Flat;
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
            const tenantData = Array.isArray(rawData)
            ? rawData.map((tenant: any) => ({
                tenantId: tenant.tenantId,
                pesel: tenant.pesel,
                name: tenant.name,
                surname: tenant.surname,
                phoneNumber: tenant.phoneNumber,
                mail: tenant.mail,
                flat: tenant.flat || {}
            }))
            : rawData ? [{
                tenantId: rawData.tenantId,
                pesel: rawData.pesel,
                name: rawData.name,
                surname: rawData.surname,
                phoneNumber: rawData.phoneNumber,
                mail: rawData.mail,
                flat: rawData.flat || {}
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
        if (!selectedBlock) {
            console.error("Blok nie został wybrany.");
            return;
        }
        console.log("Wybrany blok:", selectedBlock);
        console.log("Dane do wysłania:", JSON.stringify({
            staircaseNumber: newStaircase.staircaseNumber,
            sharedSurface: newStaircase.sharedSurface,
            block: { blockId: selectedBlock.blockId }
        }));

        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/admin/apartment_staircases", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    staircaseNumber: Number(newStaircase.staircaseNumber),
                    sharedSurface: Number(newStaircase.sharedSurface),
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
        if (!selectedFlatId) {
            console.log("No flat ID selected");
            return; // Ensure flatId is set before proceeding
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Token not found in localStorage");
            return; // Ensure token is available before proceeding
        }

        // Ensure all fields have been filled before submission
        if (!newTenant.name || !newTenant.surname || !newTenant.pesel || !newTenant.phoneNumber || !newTenant.mail) {
            console.log("Please fill all required fields");
            return;
        }

        // Data for the new tenant
        const tenantData = {
            name: newTenant.name,
            surname: newTenant.surname,
            pesel: newTenant.pesel,
            phoneNumber: newTenant.phoneNumber,
            mail: newTenant.mail,
            tenantsNumber: newTenant.tenantsNumber,
            isBacklog: newTenant.isBacklog, // Ensure isBacklog is passed if required
            flatId: selectedFlatId,  // Sending flatId as part of the request body
        };

        // Log the data being sent to the server
        console.log("Sending tenant data:", JSON.stringify(tenantData));

        try {
            const response = await fetch("http://localhost:8080/api/admin/tenants", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tenantData),
            });

            if (response.ok) {
                console.log("Tenant added successfully");
                setShowAddTenantModal(false);  // Close the modal after success

                // Reset the state for the new tenant form
                setNewTenant({
                    name: '',
                    surname: '',
                    pesel: '',
                    phoneNumber: '',
                    mail: '',
                    tenantsNumber: 1,
                    isBacklog: false,
                });
            } else {
                const errorMessage = await response.text();
                console.error("Error adding tenant:", errorMessage);
            }
        } catch (error) {
            console.error("An error occurred while adding the tenant:", error);
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

    ////USUWANIE
    const handleDeleteBlock = async (blockId: number) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/admin/blocks/${blockId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Usuń blok z lokalnego stanu
            setBlocks((prevBlocks) => prevBlocks.filter((block) => block.blockId !== blockId));
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(`Error deleting block: ${err.message}`);
            } else {
                console.error("Unknown error occurred during block deletion.");
            }
        }
    };

    const handleDeleteFlat = async (flatId: number) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/admin/flats/${flatId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Usuń mieszkanie z lokalnego stanu
            setFlats((prevFlats) => prevFlats.filter((flat) => flat.flatId !== flatId));
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(`Error deleting flat: ${err.message}`);
            } else {
                console.error("Unknown error occurred during flat deletion.");
            }
        }
    };

    const handleDeleteStaircase = async (staircaseId: number) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/admin/apartment_staircases/${staircaseId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Usuń klatkę z lokalnego stanu
            setStaircases((prevStaircases) => prevStaircases.filter((staircase) => staircase.apartmentStaircaseId !== staircaseId));
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(`Error deleting staircase: ${err.message}`);
            } else {
                console.error("Unknown error occurred during staircase deletion.");
            }
        }
    };

    const handleDeleteTenant = async (tenantId: number) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/api/admin/tenants/${tenantId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Mieszkaniec został usunięty");
                // Usuń mieszkańca z lokalnego stanu
                setTenants((prevTenants) => prevTenants.filter((tenant) => tenant.tenantId !== tenantId));
            } else {
                console.error("Błąd podczas usuwania mieszkańca");
            }
        } catch (error) {
            console.error("Wystąpił błąd podczas usuwania mieszkańca:", error);
        }
    };





    const handleEditClick = (item: Block | ApartmentStaircase | Flat) => {
        setEditingItem(item);
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if(!editingItem) return;
        try {
            let endpoint_id = null;
            let endpoint_dir = null;
            let data = {};
            const token = localStorage.getItem("token");
            if ("blockId" in editingItem) {
                endpoint_id = editingItem.blockId;
                endpoint_dir = "blocks"


                data = {
                    blockId: editingItem.blockId,
                    city: editingItem.city,
                    street: editingItem.street,
                    buildingNumber : editingItem.buildingNumber
                };

                // Typ obiektu to Block
                console.log("Editing Block:", editingItem);
            } else if ("apartmentStaircaseId" in editingItem) {
                endpoint_id = editingItem.apartmentStaircaseId;
                endpoint_dir = "apartment_staircases"

                data = {
                    apartmentStaircaseId: editingItem.apartmentStaircaseId,
                    sharedSurface: editingItem.sharedSurface,
                    staircaseNumber: editingItem.staircaseNumber,
                    block : editingItem.block
                };

                // Typ obiektu to ApartmentStaircase
                console.log("Editing ApartmentStaircase:", editingItem);
            } else if ("flatId" in editingItem) {
                endpoint_id = editingItem.flatId;
                endpoint_dir = "flats"

                data = {
                    flatId : editingItem.flatId,
                    flatNumber : editingItem.flatNumber ,
                    surface: editingItem.surface,
                    aparmentStaircase : editingItem.apartmentStaircase
                };
                // Typ obiektu to Flat
                console.log("Editing Flat:", editingItem);

            } else {
                console.error("Unknown type for editingItem", editingItem);
            }

            const response = await fetch(`http://localhost:8080/api/admin/${endpoint_dir}/${endpoint_id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error("Failed to update item");
            }

            console.log("Item updated successfully");
        } catch (err:any){
            console.error("Błąd", err.message || err)
        }
        setShowEditModal(false);
    };
    useAuth();
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
                                            <button
                                                onClick={() => handleDeleteBlock(block.blockId)}
                                                className="bg-red-500 text-white px-2 py-1 ml-3 rounded-lg"
                                            >
                                                Usuń blok
                                            </button>
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
                                                                <button
                                                                    onClick={() => handleDeleteStaircase(staircase.apartmentStaircaseId)}
                                                                    className="bg-red-500 text-white px-2 py-1 ml-3 rounded-lg"
                                                                >
                                                                    Usuń klatkę
                                                                </button>
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
                                                                                    <button
                                                                                        onClick={() => handleDeleteFlat(flat.flatId)}
                                                                                        className="bg-red-500 text-white px-2 py-1 rounded-lg ml-3"
                                                                                    >
                                                                                        Usuń mieszkanie
                                                                                    </button>
                                                                                </div>

                                                                                {selectedFlat && selectedFlat.flatId === flat.flatId && (
                                                                                    <div className="ml-4 border-l-2 border-gray-200 pl-4">

{tenants.length > 0 ? (
    <ul className="space-y-1 mt-2 ml-4">
        {tenants.map((tenant) => (
            <li key={tenant.tenantId} className="text-sm text-gray-700 dark:text-white font-bold">
                {tenant.name} {tenant.surname} ({tenant.pesel})
                (Tel: {tenant.phoneNumber}, Email: {tenant.mail})
                <button
                    onClick={() => handleDeleteTenant(tenant.tenantId)}
                    className="ml-4 bg-red-500 text-white px-2 py-1 rounded-lg"
                >
                    Usuń mieszkańca
                </button>
            </li>
        ))}
    </ul>
) : (
    <div className="text-sm text-gray-700 dark:text-white font-bold">
        Brak przypisanego mieszkańca
    </div>
)}


                                                                                        {/* Button to add a tenant, visible only when there are no tenants */}
                                                                                        {tenants.length === 0 && (
                                                                                            <button
                                                                                                onClick={() => handleAddTenantClick(flat.flatId)}
                                                                                                className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
                                                                                            >
                                                                                                Dodaj mieszkańca
                                                                                            </button>
                                                                                        )}
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
                                <label htmlFor="tenantsNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Liczba mieszkańców:
                                </label>
                                <input
                                    type="number"
                                    id="tenantsNumber"
                                    value={newTenant.tenantsNumber}
                                    onChange={(e) => setNewTenant({
                                        ...newTenant,
                                        tenantsNumber: e.target.value ? parseInt(e.target.value) : 1
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                    placeholder="Liczba mieszkańców"
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