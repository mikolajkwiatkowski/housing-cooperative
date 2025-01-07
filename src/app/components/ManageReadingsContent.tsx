"use client";
import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import useAuth from "@/app/useAuth";

const ManageReadingsContent = () => {
    const [cost, setCost] = useState<string>("");
    const [currentCost, setCurrentCost] = useState<number | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [meterReadings, setMeterReadings] = useState<any[]>([]);
    const [tenants, setTenants] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [newReading, setNewReading] = useState({
        reading: 0,
        readingDate: "",
        tenantName: "",
        tenantSurname: ""
    });

    const fetchCurrentCost = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setFormError("Authorization token is missing.");
                return;
            }

            const response = await fetch("http://localhost:8080/api/admin/waterCost", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setCurrentCost(data.cost);
        } catch (err: unknown) {
            setFormError((err as Error).message || "An error occurred while fetching the current cost.");
        }
    };

    const fetchMeterReadings = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setFormError("Authorization token is missing.");
                return;
            }

            const response = await fetch("http://localhost:8080/api/admin/allMeterReadings", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setMeterReadings(data.content);
        } catch (err: unknown) {
            setFormError((err as Error).message || "An error occurred while fetching the meter readings.");
        }
    };

    const fetchTenants = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setFormError("Authorization token is missing.");
                return;
            }

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
            setTenants(data);
        } catch (err: unknown) {
            setFormError((err as Error).message || "An error occurred while fetching the tenants.");
        }
    };

    const saveMeterReading = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setFormError("Authorization token is missing.");
                return;
            }

            const response = await fetch("http://localhost:8080/api/admin/saveMeterReading", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newReading),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            setSuccessMessage("Meter reading has been successfully saved.");
            setIsAdding(false);
            fetchMeterReadings(); // Update the meter readings list
        } catch (err: unknown) {
            setFormError((err as Error).message || "An error occurred while saving the meter reading.");
        }
    };

    useEffect(() => {
        fetchCurrentCost();
        fetchMeterReadings();
        fetchTenants();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const costValue = parseFloat(cost);
        if (isNaN(costValue) || costValue <= 0) {
            setFormError("Cost must be a number greater than 0.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setFormError("Authorization token is missing.");
                return;
            }

            const response = await fetch("http://localhost:8080/api/admin/saveWaterCost", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ costId: 0, cost: costValue }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            setCost(""); // Clear input after submission
            setFormError(null); // Reset form error
            setSuccessMessage("Cost has been successfully saved.");
            fetchCurrentCost(); // Update the current cost
        } catch (err: unknown) {
            setFormError((err as Error).message || "An error occurred while saving the cost.");
        }
    };
    useAuth();
    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
            <BackButton />
            <main className="flex-grow flex flex-col p-8">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                    Zarządzaj ceną wody
                </h1>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-lg self-center w-1/3">
                    <div className="mb-4">
                        <label className="block text-black dark:text-white mb-2" htmlFor="cost">
                            Cena za m³ (PLN):
                        </label>
                        <input
                            type="text"
                            id="cost"
                            name="cost"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="w-full p-2 border rounded text-black"
                            required
                        />
                    </div>
                    {currentCost !== null && (
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Aktualna cena za m³: <strong>{currentCost} PLN</strong>
                        </p>
                    )}
                    {formError && <p className="text-red-500 mb-4">{formError}</p>}
                    {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Save
                    </button>
                </form>
                <section className="mt-10">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                        Odczyty liczników
                    </h2>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-green-600 dark:bg-emerald-600 text-white px-4 py-2 rounded-lg mb-4"
                    >
                        Dodaj
                    </button>
                    <div className="overflow-x-auto text-black dark:text-white">
                        <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                            <thead>
                            <tr>
                                <th className="text-center px-4 py-2">ID odczytu</th>
                                <th className="text-center px-4 py-2">Imię i nazwisko mieszkańca</th>
                                <th className="text-center px-4 py-2">Data odczytu</th>
                                <th className="text-center px-4 py-2">Wartość licznika</th>
                            </tr>
                            </thead>
                            <tbody>
                            {meterReadings.map((reading) => (
                                <tr key={reading.readingId} className="border-b border-gray-200 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-600">
                                    <td className="text-center px-4 py-2">{reading.readingId}</td>
                                    <td className="text-center px-4 py-2">{`${reading.tenant.name} ${reading.tenant.surname}`}</td>
                                    <td className="text-center px-4 py-2">{new Date(reading.readingDate).toLocaleDateString()}</td>
                                    <td className="text-center px-4 py-2">{reading.meterReading}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                {isAdding && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                                Add Meter Reading
                            </h2>
                            <div className="flex flex-col gap-4">
                                <label className="text-black dark:text-white">
                                    Meter Reading:
                                    <input
                                        type="number"
                                        name="reading"
                                        value={newReading.reading}
                                        onChange={(e) => setNewReading({ ...newReading, reading: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600"
                                    />
                                </label>
                                <label className="text-black dark:text-white">
                                    Reading Date:
                                    <input
                                        type="date"
                                        name="readingDate"
                                        value={newReading.readingDate}
                                        onChange={(e) => setNewReading({ ...newReading, readingDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600"
                                    />
                                </label>
                                <label className="text-black dark:text-white">
                                    Tenant Name:
                                    <input
                                        type="text"
                                        name="tenantName"
                                        value={newReading.tenantName}
                                        onChange={(e) => setNewReading({ ...newReading, tenantName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600"
                                    />
                                </label>
                                <label className="text-black dark:text-white">
                                    Tenant Surname:
                                    <input
                                        type="text"
                                        name="tenantSurname"
                                        value={newReading.tenantSurname}
                                        onChange={(e) => setNewReading({ ...newReading, tenantSurname: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600"
                                    />
                                </label>
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="bg-neutral-600 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveMeterReading}
                                    className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManageReadingsContent;