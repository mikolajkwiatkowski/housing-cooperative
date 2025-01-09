"use client";
import React, { useState, useEffect } from "react";

const InvoicePageContent: React.FC = () => {
    const invoiceCategories = ["WATER", "SHARED_ELECTRICITY", "RENT"];
    const [invoices, setInvoices] = useState([]);
    const [formData, setFormData] = useState({
        invoiceId: 16, // Ustawiona na sztywno wartość
        invoiceNumber: "",
        tenantId: 0,
        invoiceCategory: "",
        issueDate: "",
        paymentDate: "",
        sum: 0,
        isPaid: false,
    });
    const [tenantName, setTenantName] = useState("");
    const [tenantSurname, setTenantSurname] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found in local storage");
                }

                const response = await fetch("http://localhost:8080/api/admin/invoices", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch invoices");
                }

                const data = await response.json();
                setInvoices(data.content);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };

        fetchInvoices();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleTenantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "tenantName") {
            setTenantName(value);
        } else if (name === "tenantSurname") {
            setTenantSurname(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found in local storage");
            }

            const tenantResponse = await fetch(`http://localhost:8080/api/admin/tenants/getTenantByNameAndSurname/${tenantName}/${tenantSurname}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!tenantResponse.ok) {
                throw new Error("Failed to fetch tenant data");
            }
            const tenantData = await tenantResponse.json();
            const tenantId = tenantData.tenantId; // Extract tenantId from the response

            const payload = {
                ...formData,
                tenantId,
                invoiceId: 16, // Hardcoded value
                issueDate: new Date(formData.issueDate).toISOString().slice(0, 10),
                paymentDate: new Date(formData.paymentDate).toISOString().slice(0, 10),
            };

            const response = await fetch("http://localhost:8080/api/admin/invoices/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.log(payload);
                throw new Error("Server response error");
            }

            const data = await response.json();
            console.log("Invoice saved successfully:", data);
            setIsSuccessVisible(true);
            setTimeout(() => {
                setIsSuccessVisible(false);
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Error saving invoice:", error);
        }
    };

    return (
        <div className="flex flex-col bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">Lista Faktur</h2>
            <button
                onClick={() => setIsFormVisible(true)}
                className="mb-4 bg-blue-500 text-white p-3 rounded-md shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-200"
            >
                Dodaj Formularz
            </button>
            <table className="min-w-full bg-white dark:bg-neutral-800">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Numer Faktury</th>
                    <th className="py-2 px-4 border-b">Kategoria</th>
                    <th className="py-2 px-4 border-b">Data Wystawienia</th>
                    <th className="py-2 px-4 border-b">Data Płatności</th>
                    <th className="py-2 px-4 border-b">Kwota</th>
                    <th className="py-2 px-4 border-b">Opłacone</th>
                </tr>
                </thead>
                <tbody>
                {invoices.map((invoice) => (
                    <tr key={invoice.invoiceId}>
                        <td className="py-2 px-4 border-b">{invoice.invoiceId}</td>
                        <td className="py-2 px-4 border-b">{invoice.invoiceNumber}</td>
                        <td className="py-2 px-4 border-b">{invoice.invoiceCategory}</td>
                        <td className="py-2 px-4 border-b">{invoice.issueDate}</td>
                        <td className="py-2 px-4 border-b">{invoice.paymentDate}</td>
                        <td className="py-2 px-4 border-b">{invoice.sum}</td>
                        <td className="py-2 px-4 border-b">{invoice.paid ? "Tak" : "Nie"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                            Dodaj Fakturę
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300">Imię</label>
                                <input
                                    type="text"
                                    name="tenantName"
                                    value={tenantName}
                                    onChange={handleTenantChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300">Nazwisko</label>
                                <input
                                    type="text"
                                    name="tenantSurname"
                                    value={tenantSurname}
                                    onChange={handleTenantChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300">Numer Faktury</label>
                                <input
                                    type="text"
                                    name="invoiceNumber"
                                    value={formData.invoiceNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300">Kategoria Faktury</label>
                                <select
                                    name="invoiceCategory"
                                    value={formData.invoiceCategory}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                                    required
                                >
                                    <option value="">Wybierz kategorię</option>
                                    {invoiceCategories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300">Data Wystawienia</label>
                                <input
                                    type="date"
                                    name="issueDate"
                                    value={formData.issueDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300">Data Płatności</label>
                                <input
                                    type="date"
                                    name="paymentDate"
                                    value={formData.paymentDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300">Kwota</label>
                                <input
                                    type="number"
                                    name="sum"
                                    value={formData.sum}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isPaid"
                                    checked={formData.isPaid}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                                />
                                <label className="ml-2 block text-gray-700 dark:text-gray-300">Opłacone</label>
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    onClick={() => setIsFormVisible(false)}
                                    className="bg-neutral-600 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Zapisz Fakturę
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isSuccessVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                            Dane zostały pomyślnie dodane!
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoicePageContent;