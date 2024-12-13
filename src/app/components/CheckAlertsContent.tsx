import React, { useState } from "react";
import BackButton from "./BackButton";

type Alert = {
    id: number;
    data: string;
    opis: string;
    nrMieszkania: number;
    czy_naprawione: boolean;
};

const CheckAlertsContent = () => {
    const [alerts, setAlerts] = useState<Alert[]>([
        {
            id: 1,
            data: "2024-12-01",
            opis: "Zepsuta instalacja elektryczna",
            nrMieszkania: 101,
            czy_naprawione: false,
        },
        {
            id: 2,
            data: "2024-12-05",
            opis: "Zatkany odpływ w łazience",
            nrMieszkania: 102,
            czy_naprawione: false,
        },
    ]);

    const handleCheckboxChange = (id: number) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === id ? { ...alert, czy_naprawione: !alert.czy_naprawione } : alert
            )
        );
    };

    const handleDeleteAlert = (id: number) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    const repairedAlerts = alerts.filter((alert) => alert.czy_naprawione);
    const unRepairedAlerts = alerts.filter((alert) => !alert.czy_naprawione);

    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
            <BackButton />
            <main className="flex-grow flex flex-col p-8">
                {/* Lista alertów */}
                <div className="mt-6">
                    <label className="block text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                        Alerty:
                    </label>
                    <div className="overflow-x-auto text-black dark:text-white">
                        <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">
                                        Zaznacz jako naprawione
                                    </th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">
                                        Data
                                    </th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">
                                        Opis
                                    </th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">
                                        Nr mieszkania
                                    </th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">
                                        Usuń
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {unRepairedAlerts.map((alert) => (
                                    <tr key={alert.id} className="border-b border-gray-200 dark:border-neutral-600">
                                        <td className="text-center px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={alert.czy_naprawione}
                                                onChange={() => handleCheckboxChange(alert.id)}
                                            />
                                        </td>
                                        <td className="text-center px-4 py-2">{alert.data}</td>
                                        <td className="text-center px-4 py-2">{alert.opis}</td>
                                        <td className="text-center px-4 py-2">{alert.nrMieszkania}</td>
                                        <td className="text-center px-4 py-2">
                                            <button
                                                onClick={() => handleDeleteAlert(alert.id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                Usuń
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Alerty naprawione */}
                <div className="mt-6">
                    <label className="block text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                        Naprawione alerty:
                    </label>
                    <div className="overflow-x-auto text-black dark:text-white">
                        <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">
                                        Data
                                    </th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">
                                        Opis
                                    </th>
                                    <th className="text-center border-b-2 border-gray-300 dark:border-neutral-600 px-4 py-2">
                                        Nr mieszkania
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {repairedAlerts.map((alert) => (
                                    <tr key={alert.id} className="border-b border-gray-200 dark:border-neutral-600">
                                        <td className="text-center px-4 py-2">{alert.data}</td>
                                        <td className="text-center px-4 py-2">{alert.opis}</td>
                                        <td className="text-center px-4 py-2">{alert.nrMieszkania}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckAlertsContent;
