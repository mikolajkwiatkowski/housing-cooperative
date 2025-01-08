"use client";
import React, { useState, useEffect } from "react";
import useAuth from "@/app/useAuth";

const MenagePaymentsContent = () => {
    const [backlogTenants, setBacklogTenants] = useState<any[]>([]);
    const [nonBacklogTenants, setNonBacklogTenants] = useState<any[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const [backlogSearch, setBacklogSearch] = useState<string>("");
    const [nonBacklogSearch, setNonBacklogSearch] = useState<string>("");

    const fetchBacklogTenants = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setFormError("Authorization token is missing.");
                return;
            }

            const response = await fetch("http://localhost:8080/api/admin/tenants/getTenantByIsBacklog/1", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setBacklogTenants(data.content);
        } catch (err: unknown) {
            setFormError((err as Error).message || "An error occurred while fetching backlog tenants.");
        }
    };

    const fetchNonBacklogTenants = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setFormError("Authorization token is missing.");
                return;
            }

            const response = await fetch("http://localhost:8080/api/admin/tenants/getTenantByIsBacklog/0", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setNonBacklogTenants(data.content);
        } catch (err: unknown) {
            setFormError((err as Error).message || "An error occurred while fetching non-backlog tenants.");
        }
    };

    const updateBacklogStatus = async (tenantId: number, isBacklog: boolean) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setFormError("Authorization token is missing.");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/admin/tenants/${tenantId}/updateBacklog`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isBacklog }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Refresh the tenant lists
            fetchBacklogTenants();
            fetchNonBacklogTenants();
        } catch (err: unknown) {
            setFormError((err as Error).message || "An error occurred while updating backlog status.");
        }
    };

    useEffect(() => {
        fetchBacklogTenants();
        fetchNonBacklogTenants();
    }, []);

    const filteredBacklogTenants = backlogTenants.filter(tenant =>
        tenant.name.toLowerCase().includes(backlogSearch.toLowerCase()) ||
        tenant.surname.toLowerCase().includes(backlogSearch.toLowerCase())
    );

    const filteredNonBacklogTenants = nonBacklogTenants.filter(tenant =>
        tenant.name.toLowerCase().includes(nonBacklogSearch.toLowerCase()) ||
        tenant.surname.toLowerCase().includes(nonBacklogSearch.toLowerCase())
    );
    useAuth();
    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen p-8">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                Zarządzanie Płatnościami
            </h1>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <section className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Najemcy z Zaległościami
                </h2>
                <input
                    type="text"
                    placeholder="Szukaj najemców z zaległościami..."
                    value={backlogSearch}
                    onChange={(e) => setBacklogSearch(e.target.value)}
                    className="mb-4 p-2 rounded-lg border border-gray-300"
                />
                <div className="overflow-x-auto text-black dark:text-white">
                    <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                        <thead>
                        <tr>
                            <th className="text-center px-4 py-2">ID Najemcy</th>
                            <th className="text-center px-4 py-2">Imię</th>
                            <th className="text-center px-4 py-2">Nazwisko</th>
                            <th className="text-center px-4 py-2">Email</th>
                            <th className="text-center px-4 py-2">Telefon</th>
                            <th className="text-center px-4 py-2">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredBacklogTenants.map((tenant) => (
                            <tr key={tenant.tenantId} className="border-b border-gray-200 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-600">
                                <td className="text-center px-4 py-2">{tenant.tenantId}</td>
                                <td className="text-center px-4 py-2">{tenant.name}</td>
                                <td className="text-center px-4 py-2">{tenant.surname}</td>
                                <td className="text-center px-4 py-2">{tenant.mail}</td>
                                <td className="text-center px-4 py-2">{tenant.phoneNumber}</td>
                                <td className="text-center px-4 py-2">
                                    <button
                                        onClick={() => updateBacklogStatus(tenant.tenantId, false)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Anuluj Zaległość
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
            <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Najemcy bez Zaległości
                </h2>
                <input
                    type="text"
                    placeholder="Szukaj najemców bez zaległości..."
                    value={nonBacklogSearch}
                    onChange={(e) => setNonBacklogSearch(e.target.value)}
                    className="mb-4 p-2 rounded-lg border border-gray-300"
                />
                <div className="overflow-x-auto text-black dark:text-white">
                    <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                        <thead>
                        <tr>
                            <th className="text-center px-4 py-2">ID Najemcy</th>
                            <th className="text-center px-4 py-2">Imię</th>
                            <th className="text-center px-4 py-2">Nazwisko</th>
                            <th className="text-center px-4 py-2">Email</th>
                            <th className="text-center px-4 py-2">Telefon</th>
                            <th className="text-center px-4 py-2">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredNonBacklogTenants.map((tenant) => (
                            <tr key={tenant.tenantId} className="border-b border-gray-200 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-600">
                                <td className="text-center px-4 py-2">{tenant.tenantId}</td>
                                <td className="text-center px-4 py-2">{tenant.name}</td>
                                <td className="text-center px-4 py-2">{tenant.surname}</td>
                                <td className="text-center px-4 py-2">{tenant.mail}</td>
                                <td className="text-center px-4 py-2">{tenant.phoneNumber}</td>
                                <td className="text-center px-4 py-2">
                                    <button
                                        onClick={() => updateBacklogStatus(tenant.tenantId, true)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Oznacz jako Zaległość
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default MenagePaymentsContent;
