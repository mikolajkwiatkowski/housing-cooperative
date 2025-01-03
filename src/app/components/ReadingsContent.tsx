"use client";
import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";

// Typowanie danych z API
type WaterConsumptionLog = {
    logId: number;
    consumptionDate: string;
    consumption: number;
    meterReading: number;
};

const CheckWaterLogsContent = () => {
    const [logs, setLogs] = useState<WaterConsumptionLog[]>([]);
    const [selectedLog, setSelectedLog] = useState<WaterConsumptionLog | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [consumption, setConsumption] = useState<number>(0);
    const [formError, setFormError] = useState<string | null>(null);

    // Pobieranie danych z API
    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Brak tokenu autoryzacji.");
                return;
            }

            setIsLoading(true);
            const response = await fetch("http://localhost:8080/api/user/water-consumption", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("Response Status:", response.status);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("API Response:", data);
            setLogs(Array.isArray(data) ? data : []);
        } catch (err: unknown) {
            console.error("Fetch error:", err);
            setError((err as Error).message || "Wystąpił błąd podczas ładowania danych.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleRowClick = (log: WaterConsumptionLog) => {
        setSelectedLog(log);
        setIsEditing(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (consumption <= 0) {
            setFormError("Zużycie musi być większe od 0.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setFormError("Brak tokenu autoryzacji.");
                return;
            }

            const response = await fetch("http://localhost:8080/api/user/send-consumption", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ consumption }),
            });

            console.log("Submit Response Status:", response.status);
            const responseBody = await response.text();
            console.log("Submit Response Body:", responseBody);

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            setConsumption(0); // Clear input after submission
            setFormError(null); // Reset form error
            fetchLogs(); // Refresh the logs after submission
        } catch (err: unknown) {
            console.error("Submit error:", err);
            setFormError((err as Error).message || "Wystąpił błąd podczas deklaracji zużycia.");
        }
    };

    // Znajdź najnowszy log na podstawie daty
    const latestLog = logs.reduce((latest, current) => {
        return new Date(current.consumptionDate) > new Date(latest.consumptionDate) ? current : latest;
    }, logs[0] || { consumptionDate: "", consumption: 0, meterReading: 0 });

    const previousMonthLog = logs.reduce((prev, current) => {
        const currentDate = new Date(current.consumptionDate);
        const now = new Date();

        const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        if (currentDate >= firstDayOfPreviousMonth && currentDate <= lastDayOfPreviousMonth) {
            return currentDate > new Date(prev.consumptionDate) ? current : prev;
        }
        return prev;
    }, { consumptionDate: "", consumption: 0, meterReading: 0 });



    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
            <BackButton />
            <main className="flex-grow flex flex-col p-8">
                {isLoading && <p className="text-center text-gray-600 dark:text-white">Ładowanie...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!isLoading && !error && (
                    <div className="flex gap-8">
                        {/* Tabela z odczytami */}
                        <section className="mt-10 w-1/3">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                                Zadeklarowane odczyty
                            </h2>
                            <div className="overflow-x-auto text-black dark:text-white">
                                <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                    <thead>
                                    <tr>
                                        <th className="text-center px-4 py-2">Data deklaracji</th>
                                        <th className="text-center px-4 py-2">Zadeklarowane zużycie (m³)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Array.isArray(logs) && logs.length > 0 ? (
                                        logs.map((log) => (
                                            <tr
                                                key={log.logId}
                                                className="border-b border-gray-200 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-600 cursor-pointer"
                                                onClick={() => handleRowClick(log)}
                                            >
                                                <td className="text-center px-4 py-2">{log.consumptionDate}</td>
                                                <td className="text-center px-4 py-2">{log.consumption.toFixed(2)} m³</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="text-center py-4 text-gray-600 dark:text-white">
                                                Brak dostępnych danych.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Tabela z najnowszym stanem licznika */}
                        <section className="mt-10 w-1/3">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                                Bieżący stan licznika
                            </h2>
                            <div className="overflow-x-auto text-black dark:text-white">
                                <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                    <thead>
                                    <tr>
                                        <th className="text-center px-4 py-2">Odczyt licznika (m³)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {latestLog && latestLog.meterReading !== 0 ? (
                                        <tr className="border-b border-gray-200 dark:border-neutral-600">
                                            <td className="text-center px-4 py-2">{latestLog.meterReading.toFixed(2)}</td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td className="text-center py-4 text-gray-600 dark:text-white">
                                                Brak danych o najnowszym odczycie.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                                Stan na dzień: <strong>{latestLog?.consumptionDate || "Brak danych"}</strong>
                            </p>
                        </section>

                        {/* Tabela z odczytem licznika z poprzedniego miesiąca */}
                        <section className="mt-10 w-1/3">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                                Stan licznika z poprzedniego miesiąca
                            </h2>
                            <div className="overflow-x-auto text-black dark:text-white">
                                <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                    <thead>
                                    <tr>
                                        <th className="text-center px-4 py-2">Odczyt licznika (m³)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {previousMonthLog && previousMonthLog.meterReading !== 0 ? (
                                        <tr className="border-b border-gray-200 dark:border-neutral-600">
                                            <td className="text-center px-4 py-2">{previousMonthLog.meterReading.toFixed(2)}</td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td className="text-center py-4 text-gray-600 dark:text-white">
                                                Brak danych o odczycie z poprzedniego miesiąca.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                                Stan na dzień: <strong>{previousMonthLog?.consumptionDate || "Brak danych"}</strong>
                            </p>
                        </section>

                        {/* Formularz deklaracji zużycia */}
                        <section className="mt-10 w-1/3">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                                Deklaracja zużycia
                            </h2>
                            <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-lg">
                                <div className="mb-4">
                                    <label className="block text-black dark:text-white mb-2" htmlFor="consumption">
                                        Zużycie (m³):
                                    </label>
                                    <input
                                        type="number"
                                        id="consumption"
                                        name="consumption"
                                        value={isNaN(consumption) ? '' : consumption}  // Make sure the value is a valid number or empty string
                                        onChange={(e) => setConsumption(e.target.value ? parseFloat(e.target.value) : 0)}  // Ensure valid number input
                                        className="w-full p-2 border rounded text-black"
                                        required
                                    />

                                </div>
                                {formError && <p className="text-red-500 mb-4">{formError}</p>}
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Zatwierdź
                                </button>
                            </form>
                        </section>
                    </div>
                )}

                {/* Modal szczegółów */}
                {isEditing && selectedLog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                                Szczegóły odczytu
                            </h2>
                            <div className="flex flex-col gap-4">
                                <label>Data odczytu: {selectedLog.consumptionDate}</label>
                                <label>Zużycie (m³): {selectedLog.consumption}</label>
                                <label>Odczyt licznika: {selectedLog.meterReading}</label>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Zamknij
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CheckWaterLogsContent;