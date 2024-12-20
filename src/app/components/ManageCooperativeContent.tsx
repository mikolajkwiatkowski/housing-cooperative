import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";

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

const ManageCooperativeContent = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
    const [staircases, setStaircases] = useState<ApartmentStaircase[]>([]);
    const [selectedStaircase, setSelectedStaircase] = useState<ApartmentStaircase | null>(null);
    const [flats, setFlats] = useState<Flat[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Funkcja do pobierania bloków
    const fetchBlocks = async () => {
        try {
            const token = localStorage.getItem("token");
            setIsLoading(true);
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
            setBlocks(data.content);
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd podczas ładowania danych.");
        } finally {
            setIsLoading(false);
        }
    };

    // Funkcja do pobierania klatek dla wybranego bloku
    const fetchStaircases = async (blockId: number) => {
        try {
            const token = localStorage.getItem("token");
            setIsLoading(true);
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
            setStaircases(data.content);
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd podczas ładowania klatek.");
        } finally {
            setIsLoading(false);
        }
    };

    // Funkcja do pobierania mieszkań dla wybranej klatki
    const fetchFlats = async (staircaseId: number) => {
        try {
            const token = localStorage.getItem("token");
            setIsLoading(true);
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
            setFlats(data.content);
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd podczas ładowania mieszkań.");
        } finally {
            setIsLoading(false);
        }
    };

    // Użycie useEffect do załadowania bloków przy pierwszym renderowaniu komponentu
    useEffect(() => {
        fetchBlocks();
    }, []);

    // Funkcja do obsługi kliknięcia na blok
    const handleBlockClick = (block: Block) => {
        setSelectedBlock(block);
        setStaircases([]);
        setFlats([]);
        fetchStaircases(block.blockId);
    };

    // Funkcja do obsługi kliknięcia na klatkę
    const handleStaircaseClick = (staircase: ApartmentStaircase) => {
        setSelectedStaircase(staircase);
        setFlats([]);
        fetchFlats(staircase.apartmentStaircaseId);
    };

    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
            <BackButton />
            <main className="flex-grow flex flex-col p-8">
                {isLoading && <p className="text-center text-gray-600 dark:text-white">Ładowanie...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!isLoading && !error && (
                    <>
                        {/* Lista bloków */}
                        <div className="mt-6">
                            <label className="block text-2xl font-semibold text-gray-800 dark:text-white mb-4">Bloki:</label>
                            <div className="overflow-x-auto text-black dark:text-white">
                                <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                    <thead>
                                    <tr>
                                        <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Miasto</th>
                                        <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Ulica</th>
                                        <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Nr Budynku</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {blocks.map((block) => (
                                        <tr
                                            key={block.blockId}
                                            className="cursor-pointer border-b border-gray-200 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-600"
                                            onClick={() => handleBlockClick(block)}
                                        >
                                            <td className="text-center px-4 py-2">{block.city}</td>
                                            <td className="text-center px-4 py-2">{block.street}</td>
                                            <td className="text-center px-4 py-2">{block.buildingNumber}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Lista klatek */}
                        {selectedBlock && staircases.length > 0 && (
                            <div className="mt-6">
                                <label className="block text-2xl font-semibold text-gray-800 dark:text-white mb-4">Klatki w bloku {selectedBlock.city}, {selectedBlock.street} {selectedBlock.buildingNumber}:</label>
                                <div className="overflow-x-auto text-black dark:text-white">
                                    <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                        <thead>
                                        <tr>
                                            <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Nr klatki</th>
                                            <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Powierzchnia wspólna</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {staircases.map((staircase) => (
                                            <tr
                                                key={staircase.apartmentStaircaseId}
                                                className="cursor-pointer border-b border-gray-200 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-600"
                                                onClick={() => handleStaircaseClick(staircase)}
                                            >
                                                <td className="text-center px-4 py-2">{staircase.staircaseNumber}</td>
                                                <td className="text-center px-4 py-2">{staircase.sharedSurface}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Lista mieszkań */}
                        {selectedStaircase && flats.length > 0 && (
                            <div className="mt-6">
                                <label className="block text-2xl font-semibold text-gray-800 dark:text-white mb-4">Mieszkania w klatce {selectedStaircase.staircaseNumber}:</label>
                                <div className="overflow-x-auto text-black dark:text-white">
                                    <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                        <thead>
                                        <tr>
                                            <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Nr mieszkania</th>
                                            <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">Powierzchnia</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {flats.map((flat) => (
                                            <tr key={flat.flatId} className="border-b border-gray-200 dark:border-neutral-600">
                                                <td className="text-center px-4 py-2">{flat.flatNumber}</td>
                                                <td className="text-center px-4 py-2">{flat.surface}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default ManageCooperativeContent;
