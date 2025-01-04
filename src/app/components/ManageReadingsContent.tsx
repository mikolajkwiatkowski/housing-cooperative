"use client";
import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";

const ManageReadingsContent = () => {
    const [cost, setCost] = useState<string>("");
    const [currentCost, setCurrentCost] = useState<number | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    useEffect(() => {
        fetchCurrentCost();
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

    return (
        <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
            <BackButton />
            <main className="flex-grow flex flex-col p-8">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                    Manage Water Cost
                </h1>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-lg self-center w-1/3">
                    <div className="mb-4">
                        <label className="block text-black dark:text-white mb-2" htmlFor="cost">
                            Cost per m³ (PLN):
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
                            Current cost per m³: <strong>{currentCost} PLN</strong>
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
            </main>
        </div>
    );
};

export default ManageReadingsContent;