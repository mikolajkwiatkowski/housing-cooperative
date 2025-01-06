"use client";

import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import UserFooter from "./UserFooter";
import BackButton from "./BackButton";

const ReportPage: React.FC = () => {
    const [flatId, setFlatId] = useState<number | null>(null);
    const [description, setDescription] = useState("");
    const [tenantId, setTenantId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            setTenantId(decodedToken.tenant_id);
        }
    }, []);

    useEffect(() => {
        const fetchFlatDetails = async () => {
            if (tenantId) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(`http://localhost:8080/api/user/getByTenantId/${tenantId}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const flatId = await response.json();
                    setFlatId(flatId);
                    console.log(flatId);
                } catch (error) {
                    console.error("Error fetching flat details:", error);
                }
            }
        };

        fetchFlatDetails();
    }, [tenantId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (flatId === null) {
            console.error("Flat ID is not available");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);
            const response = await fetch(`http://localhost:8080/api/user/saveAccident`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ description, is_resolved: false, flat_id: flatId })
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Report submitted successfully:", data);
            setSuccessMessage("Alert został wysłany pomyślnie!");
            setTimeout(() => {
                window.location.reload();
            }, 2000); // Odśwież stronę po 2 sekundach
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col bg-gray-100  dark:bg-neutral-800 min-h-screen">
                <BackButton/>
                <main className="flex-grow p-8 flex justify-center text-neutral-800 dark:text-white">
                    <div className="bg-white p-6 rounded-lg shadow-xl dark:bg-neutral-900 w-full max-w-2xl">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Zgłoś problem</h2>
                        {flatId !== null ? (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
                                        Report:
                                    </label>
                                    <textarea
                                        id="description"
                                        className="w-full p-2 border rounded-lg dark:bg-neutral-700 dark:text-white"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        required
                                    ></textarea>
                                </div>
                                {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
                                <button
                                    type="submit"
                                    className="dark:bg-emerald-700 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-900 dark:text-white">Loading flat ID...</p>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default ReportPage;