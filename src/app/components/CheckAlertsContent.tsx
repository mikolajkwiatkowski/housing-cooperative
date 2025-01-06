import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";

type Flat = {
    flatId: number;
    flatNumber: number;
    surface: number;
    apartmentStaircase: {
        staircaseNumber: number;
        block: {
            buildingNumber: number;
            street: string;
            city: string;
        };
    };
};

type Alert = {
    accidentDate: string;
    description: string;
    flat: Flat;
    resolved: boolean;
    tenantName?: string; // Dodane właściwości opcjonalne
    tenantSurname?: string;
};


const CheckAlertsContent = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newAlert, setNewAlert] = useState<Alert | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [flats, setFlats] = useState<{ [key: number]: number }>({}); // Mapowanie numerów mieszkań na flatId
    const [currentPage, setCurrentPage] = useState(1); // Strona obecna
const [alertsPerPage] = useState(10); // Liczba alertów na stronę
const [currentPageUnresolved, setCurrentPageUnresolved] = useState(1); // Strona nierozwiązanych
const [currentPageResolved, setCurrentPageResolved] = useState(1); // Strona rozwiązanych
const [unresolvedAlerts, setUnresolvedAlerts] = useState<Alert[]>([]);  // State for unresolved alerts
const [resolvedAlerts, setResolvedAlerts] = useState<Alert[]>([]);      // State for resolved alerts


// Liczba rekordów
const indexOfLastAlert = currentPage * alertsPerPage;
const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);

// Funkcja zmiany strony
const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
};

const fetchAlerts = async () => {
    try {
        const token = localStorage.getItem("token");
        setIsLoading(true);

        // Pobranie nierozwiązanych alertów
        const unresolvedResponse = await fetch(`http://localhost:8080/api/admin/accident?page=${currentPageUnresolved - 1}&size=${alertsPerPage}&resolved=false`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!unresolvedResponse.ok) {
            throw new Error(`Error: ${unresolvedResponse.statusText}`);
        }
        const unresolvedData = await unresolvedResponse.json();
        setUnresolvedAlerts(unresolvedData.content); // Ustawienie danych nierozwiązanych

        // Pobranie rozwiązanych alertów
        const resolvedResponse = await fetch(`http://localhost:8080/api/admin/accident?page=${currentPageResolved - 1}&size=${alertsPerPage}&resolved=true`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!resolvedResponse.ok) {
            throw new Error(`Error: ${resolvedResponse.statusText}`);
        }
        const resolvedData = await resolvedResponse.json();
        setResolvedAlerts(resolvedData.content); // Ustawienie danych rozwiązanych
    } catch (err: any) {
        setError(err.message || "Wystąpił błąd podczas ładowania danych.");
    } finally {
        setIsLoading(false);
    }
};
const paginateUnresolved = (pageNumber: number) => {
    setCurrentPageUnresolved(pageNumber);
};

const paginateResolved = (pageNumber: number) => {
    setCurrentPageResolved(pageNumber);
};

    const fetchFlats = async () => {
        const response = await fetch("http://localhost:8080/api/admin/flats", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Flats:", data);  // Dodaj debugowanie
            const flatsMap = data.reduce((acc: { [key: number]: number }, flat: Flat) => {
                acc[flat.flatNumber] = flat.flatId;
                return acc;
            }, {});
            setFlats(flatsMap);
        }
    };
    const fetchFlatByTenantNameAndSurname = async (tenantName: string, tenantSurname: string) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/admin/flats/getByTenantNameAndSurname/${tenantName}/${tenantSurname}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const flat = await response.json();
            return flat.flatId; // Zwracamy tylko flatId
        } catch (error: any) {
            setError(error.message || "Nie udało się pobrać mieszkania.");
            return null;
        }
    };

    const saveAccident = async (accident: Alert) => {
        if (newAlert) {
            newAlert.flat.flatId = flats[newAlert.flat.flatNumber] || 0; // Przypisanie flatId
            console.log("New Alert:", newAlert);  // Debugowanie
        }
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/admin/accident", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(accident),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const updatedAccident = await response.json();
            console.log("Updated Accident:", updatedAccident);  // Debugowanie
            setAlerts((prev) =>
                prev.map((alert) =>
                    alert.flat.flatId === updatedAccident.flat.flatId ? updatedAccident : alert
                )
            );
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd podczas zapisywania danych.");
        }
    };


    useEffect(() => {
        fetchAlerts();
    }, [currentPage]);

    const handleRowClick = (alert: Alert) => {
        setSelectedAlert(alert);
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (selectedAlert) {
            const { name, value } = e.target;
            setSelectedAlert({
                ...selectedAlert,
                [name]: value,
            });
        }
    };
    const handleAddClick = () => {
        setNewAlert({
            accidentDate: new Date().toISOString(),
            description: "",
            flat: {
                flatId: 0,
                flatNumber: 0,
                surface: 0,
                apartmentStaircase: {
                    staircaseNumber: 0,
                    block: {
                        buildingNumber: 0,
                        street: "",
                        city: "",
                    },
                },
            },
            resolved: false,
        });
        setIsAdding(true);
    };

    const handleSave = async () => {
        if (selectedAlert) {
            await saveAccident(selectedAlert);
            setIsEditing(false);
            setSelectedAlert(null);
        }
    };
    
    const handleAddSave = async () => {
        if (newAlert) {
            const { tenantName, tenantSurname, description } = newAlert;
            if (!tenantName || !tenantSurname || !description) {
                setError("Wszystkie pola muszą być wypełnione.");
                return;
            }

            const flatId = await fetchFlatByTenantNameAndSurname(tenantName, tenantSurname);
            if (!flatId) {
                setError("Nie znaleziono mieszkania dla podanego lokatora.");
                return;
            }

            const alertToSave = {
                ...newAlert,
                flat: { ...newAlert.flat, flatId },
            };

            await saveAccident(alertToSave);
            setIsAdding(false);
            setNewAlert(null);
        }
    };


    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
            <BackButton />
            <main className="flex-grow flex flex-col p-8">


                {isLoading && <p className="text-center text-gray-600 dark:text-white">Ładowanie...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!isLoading && !error && (
                    <>
                        <button
                            onClick={handleAddClick}
                            className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg mb-6"
                        >
                            Dodaj Alert
                        </button>

                        {/* Nierozwiązane alerty */}
                        {/* Nierozwiązane alerty */}
                        <section className="mt-6">
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Nierozwiązane alerty
    </h2>
    <div className="overflow-x-auto text-black dark:text-white">
        <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
            <thead>
                <tr>
                    <th className="text-center px-4 py-2">Data</th>
                    <th className="text-center px-4 py-2">Opis</th>
                    <th className="text-center px-4 py-2">Nr mieszkania</th>
                    <th className="text-center px-4 py-2">ID mieszkania</th>
                </tr>
            </thead>
            <tbody>
    {unresolvedAlerts.map((alert) => (
    <tr key={`${alert.flat.flatId}-${alert.accidentDate}`} className="border-b border-gray-200 dark:border-neutral-600">            <td className="text-center px-4 py-2">{new Date(alert.accidentDate).toLocaleString()}</td>
            <td className="text-center px-4 py-2">{alert.description}</td>
            <td className="text-center px-4 py-2">{alert.flat.flatNumber}</td>
            <td className="text-center px-4 py-2">{alert.flat.flatId}</td>
        </tr>
    ))}
</tbody>

        </table>
        {/* Paginacja dla nierozwiązanych alertów */}
<div className="flex justify-center mt-6">
    <button
        onClick={() => paginateUnresolved(currentPageUnresolved - 1)}
        disabled={currentPageUnresolved === 1} // Wyłącz przycisk, jeśli to pierwsza strona
        className="px-4 py-2 bg-gray-600 text-white rounded-lg mr-4"
    >
        Poprzednia
    </button>
    <button
        onClick={() => paginateUnresolved(currentPageUnresolved + 1)}
        disabled={unresolvedAlerts.length < alertsPerPage} // Jeśli mniej niż `alertsPerPage`, wyłącz przycisk
        className="px-4 py-2 bg-gray-600 text-white rounded-lg"
    >
        Następna
    </button>
</div>

    </div>
</section>



                        {/* Rozwiązane alerty */}
                        <section className="mt-10">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                                Rozwiązane alerty
                            </h2>
                            <div className="overflow-x-auto text-black dark:text-white">
                                <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="text-center px-4 py-2">Data</th>
                                            <th className="text-center px-4 py-2">Opis</th>
                                            <th className="text-center px-4 py-2">Nr mieszkania</th>
                                            <th className="text-center px-4 py-2">ID mieszkania</th>

                                        </tr>
                                    </thead>
                                    <tbody>
    {resolvedAlerts.map((alert) => (
        <tr
            key={`${alert.flat.flatId}-${alert.accidentDate}`} // Możesz użyć kombinacji pól jako `key`
            className="border-b border-gray-200 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-600 cursor-pointer"
            onClick={() => handleRowClick(alert)}
        >
            <td className="text-center px-4 py-2">{new Date(alert.accidentDate).toLocaleString()}</td>
            <td className="text-center px-4 py-2">{alert.description}</td>
            <td className="text-center px-4 py-2">{alert.flat.flatNumber}</td>
            <td className="text-center px-4 py-2">{alert.flat.flatId}</td>
        </tr>
    ))}
</tbody>

                                </table>
                            </div>
                            {/* Paginacja dla rozwiązanych alertów */}
<div className="flex justify-center mt-6">
    <button
        onClick={() => paginateResolved(currentPageResolved - 1)}
        disabled={currentPageResolved === 1} // Wyłącz przycisk, jeśli to pierwsza strona
        className="px-4 py-2 bg-gray-600 text-white rounded-lg mr-4"
    >
        Poprzednia
    </button>
    <button
        onClick={() => paginateResolved(currentPageResolved + 1)}
        disabled={resolvedAlerts.length < alertsPerPage} // Jeśli mniej niż `alertsPerPage`, wyłącz przycisk
        className="px-4 py-2 bg-gray-600 text-white rounded-lg"
    >
        Następna
    </button>
</div>

                        </section>

                        {/* Modal edycji */}
                        {isEditing && selectedAlert && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                                        Edytuj alert
                                    </h2>
                                    <div className="flex flex-col gap-4">
                                        <label className="text-black dark:text-white">
                                            Data:
                                            <input
                                                type="text"
                                                name="accidentDate"
                                                value={selectedAlert.accidentDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600"
                                            />
                                        </label>
                                        <label className="text-black dark:text-white">
                                            Opis:
                                            <textarea
                                                name="description"
                                                value={selectedAlert.description}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600"
                                            />
                                        </label>
                                        <label className="text-black dark:text-white">
                                            Rozwiązany:
                                            <input
                                                type="checkbox"
                                                name="resolved"
                                                checked={selectedAlert.resolved}
                                                onChange={() =>
                                                    setSelectedAlert({
                                                        ...selectedAlert,
                                                        resolved: !selectedAlert.resolved,
                                                    })
                                                }
                                                className="ml-2 "
                                            />
                                        </label>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-4">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="bg-neutral-600 dark:bg-neutral-700  text-white px-4 py-2 rounded-lg"
                                        >
                                            Anuluj
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            Zapisz
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isAdding && newAlert && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                                        Dodaj nowy alert
                                    </h2>
                                    <div className="flex flex-col gap-4">
                                        <label className="text-black dark:text-white">
                                            Imię lokatora:
                                            <input
                                                type="text"
                                                name="tenantName"
                                                value={newAlert?.tenantName || ""}
                                                onChange={(e) =>
                                                    setNewAlert((prev) => ({
                                                        ...prev!,
                                                        tenantName: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600"
                                            />
                                        </label>
                                        <label className="text-black dark:text-white">
                                            Nazwisko lokatora:
                                            <input
                                                type="text"
                                                name="tenantSurname"
                                                value={newAlert?.tenantSurname || ""}
                                                onChange={(e) =>
                                                    setNewAlert((prev) => ({
                                                        ...prev!,
                                                        tenantSurname: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600"
                                            />
                                        </label>

                                        <label className="text-black dark:text-white">
                                            Opis:
                                            <textarea
                                                name="description"
                                                value={newAlert.description}
                                                onChange={(e) =>
                                                    setNewAlert((prev) => ({
                                                        ...prev!,
                                                        description: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600"
                                            />
                                        </label>

                                    </div>
                                    <div className="mt-6 flex justify-end gap-4">
                                        <button
                                            onClick={() => setIsAdding(false)}
                                            className="bg-neutral-600 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            Anuluj
                                        </button>
                                        <button
                                            onClick={handleAddSave}
                                            className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            Dodaj
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </>
                )}
            </main>
        </div>
    );
};

export default CheckAlertsContent;
