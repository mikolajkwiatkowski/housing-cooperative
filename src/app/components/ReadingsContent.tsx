"use client";
import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";

// Typowanie danych z API
type WaterConsumptionLog = {
    logId: number;
    consumptionDate: string;
    consumption: number;
};

type Tenant = {
    tenantId: number;
    pesel: string;
    name: string;
    surname: string;
    phoneNumber: string;
    isBacklog: boolean;
    tenantsNumber: number;
    mail: string;
    waterConsumptionLogs: WaterConsumptionLog[];
    invoices: any[];
};

type MeterReading = {
    readingId: number;
    tenant: Tenant;
    readingDate: string;
    meterReading: number;
    waterConsumptionLogs: WaterConsumptionLog[];
};

const CheckWaterLogsContent = () => {
    const [currentReading, setCurrentReading] = useState<MeterReading | null>(null);
    const [previousReading, setPreviousReading] = useState<MeterReading | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [waterCost, setWaterCost] = useState<number | null>(null);
    const [consumption, setConsumption] = useState<number>(0);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Pobieranie danych z API
    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Brak tokenu autoryzacji.");
                return;
            }

            setIsLoading(true);
            const response = await fetch("http://localhost:8080/api/user/getLatestMeterReading", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setCurrentReading(data);
        } catch (err: unknown) {
            setError((err as Error).message || "Wystąpił błąd podczas ładowania danych.");
        } finally {
            setIsLoading(false);
        }
    };

    // Pobieranie danych z poprzedniego miesiąca
    const fetchPreviousMonthLog = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Brak tokenu autoryzacji.");
                return;
            }

            const response = await fetch("http://localhost:8080/api/user/getLastMonthMeterReading", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setPreviousReading(data);
        } catch (err: unknown) {
            setError((err as Error).message || "Wystąpił błąd podczas ładowania danych z poprzedniego miesiąca.");
        }
    };

    // Pobieranie kosztu wody
    const fetchWaterCost = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Brak tokenu autoryzacji.");
                return;
            }

            const response = await fetch("http://localhost:8080/api/user/waterCost", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setWaterCost(data.cost);
        } catch (err: unknown) {
            setError((err as Error).message || "Wystąpił błąd podczas ładowania kosztu wody.");
        }
    };

    useEffect(() => {
        fetchLogs();
        fetchPreviousMonthLog();
        fetchWaterCost();
    }, []);

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

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            setConsumption(0); // Clear input after submission
            setFormError(null); // Reset form error
            setSuccessMessage("Zużycie zostało zadeklarowane.");
            fetchLogs(); // Refresh the logs after submission
        } catch (err: unknown) {
            setFormError((err as Error).message || "Wystąpił błąd podczas deklaracji zużycia.");
        }
    };

    // Oblicz różnicę między bieżącym stanem licznika a stanem z poprzedniego miesiąca
    const consumptionDifference = currentReading?.meterReading !== undefined && previousReading?.meterReading !== undefined
        ? (currentReading.meterReading - previousReading.meterReading).toFixed(2)
        : "Brak danych";

    // Oblicz koszt rachunku za wodę
    const totalCost = waterCost && consumptionDifference !== "Brak danych"
        ? (parseFloat(consumptionDifference) * waterCost).toFixed(2)
        : "Brak danych";

    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
            <BackButton />
            <main className="flex-grow flex flex-col p-8">
                {isLoading && <p className="text-center text-gray-600 dark:text-white">Ładowanie...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!isLoading && !error && (
                    <div className="flex flex-col gap-8">
                        <div className="flex gap-8 justify-center">
                            {/* Tabela z odczytami */}
                            <section className="mt-10 w-1/3 p-4 bg-white dark:bg-neutral-700 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                                    Zadeklarowane stany liczników
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
                                        {currentReading?.tenant.waterConsumptionLogs.map((log) => (
                                            <tr key={log.logId} className="border-b border-gray-200 dark:border-neutral-600">
                                                <td className="text-center px-4 py-2">{log.consumptionDate}</td>
                                                <td className="text-center px-4 py-2">{log.consumption}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Tabela z najnowszym stanem licznika */}
                            <section className="mt-10 w-1/3 p-4 bg-white dark:bg-neutral-700 rounded-lg shadow-lg">
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
                                        <tr className="border-b border-gray-200 dark:border-neutral-600">
                                            <td className="text-center px-4 py-2">{currentReading?.meterReading || "Brak danych"}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                                    Stan na dzień: <strong>{currentReading?.readingDate || "Brak danych"}</strong>
                                </p>
                            </section>

                            {/* Tabela z różnicą */}
                            <section className="mt-10 w-1/3 p-4 bg-white dark:bg-neutral-700 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                                    Prognozowane zużycie wody
                                </h2>
                                <div className="overflow-x-auto text-black dark:text-white">
                                    <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                        <thead>
                                        <tr>
                                            <th className="text-center px-4 py-2">Różnica (m³)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr className="border-b border-gray-200 dark:border-neutral-600">
                                            <td className="text-center px-4 py-2">{consumptionDifference}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>

                        <div className="flex gap-8 justify-center">
                            {/* Tabela z kosztem */}
                            <section className="mt-10 w-1/3 p-4 bg-white dark:bg-neutral-700 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                                    Koszt rachunku za wodę
                                </h2>
                                <div className="overflow-x-auto text-black dark:text-white">
                                    <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                                        <thead>
                                        <tr>
                                            <th className="text-center px-4 py-2">Koszt (zł)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr className="border-b border-gray-200 dark:border-neutral-600">
                                            <td className="text-center px-4 py-2">{totalCost}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Tabela z odczytem licznika z poprzedniego miesiąca */}
                            <section className="mt-10 w-1/3 p-4 bg-white dark:bg-neutral-700 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
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
                                        <tr className="border-b border-gray-200 dark:border-neutral-600">
                                            <td className="text-center px-4 py-2">{previousReading?.meterReading || "Brak danych"}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                                    Stan na dzień: <strong>{previousReading?.readingDate || "Brak danych"}</strong>
                                </p>
                            </section>

                            {/* Formularz deklaracji zużycia */}
                            <section className="mt-10 w-1/3 p-4 bg-white dark:bg-neutral-700 rounded-lg shadow-lg">
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
                                            value={consumption}
                                            onChange={(e) => setConsumption(parseFloat(e.target.value))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 dark:focus:outline-emerald-600 focus:border-transparent dark:bg-neutral-600 text-neutral-700 dark:text-gray-300"
                                            placeholder="Wprowadź zużycie"
                                            step="0.1"
                                            min="0"
                                        />
                                    </div>
                                    {formError && <p className="text-red-500 mb-4">{formError}</p>}
                                    {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
                                    <button
                                        type="submit"
                                        className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Zatwierdź
                                    </button>
                                </form>
                            </section>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CheckWaterLogsContent;