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

    const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false); // State for delete confirmation
    const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null); // To store the invoice ID to delete

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

    const handleDeleteInvoice = async (invoiceId: number) => {
        setInvoiceToDelete(invoiceId); // Set the invoice to be deleted
        setIsDeleteConfirmationVisible(true); // Show confirmation modal
    };

    const confirmDeleteInvoice = async () => {
        if (invoiceToDelete !== null) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found in local storage");
                }

                const response = await fetch(`http://localhost:8080/api/admin/invoices/${invoiceToDelete}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to delete invoice");
                }

                // Remove deleted invoice from state
                setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.invoiceId !== invoiceToDelete));

                console.log("Invoice deleted successfully");
            } catch (error) {
                console.error("Error deleting invoice:", error);
            }
        }
        setIsDeleteConfirmationVisible(false); // Close confirmation modal
    };

    const cancelDeleteInvoice = () => {
        setIsDeleteConfirmationVisible(false); // Close confirmation modal
    };

    return (
        <div className="flex flex-col bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg">
            {/* Tytuł */}
            <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">Lista Faktur</h2>

            {/* Przycisk */}
            <button
                onClick={() => setIsFormVisible(true)}
                className="mb-4 bg-blue-500 text-white p-3 rounded-md shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-200"
            >
                Dodaj Formularz
            </button>

            {/* Tabela */}
            <table className="min-w-full bg-white dark:bg-neutral-800 text-black dark:text-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b text-left">ID</th>
                    <th className="py-2 px-4 border-b text-left">Numer Faktury</th>
                    <th className="py-2 px-4 border-b text-left">Kategoria</th>
                    <th className="py-2 px-4 border-b text-left">Data Wystawienia</th>
                    <th className="py-2 px-4 border-b text-left">Data Płatności</th>
                    <th className="py-2 px-4 border-b text-left">Kwota</th>
                    <th className="py-2 px-4 border-b text-left">Opłacone</th>
                    <th className="py-2 px-4 border-b text-left">Akcje</th>
                </tr>
                </thead>
                <tbody>
                {invoices.map((invoice) => (
                    <tr
                        key={invoice.invoiceId}
                        className="hover:bg-gray-100 dark:hover:bg-neutral-700"
                    >
                        <td className="py-2 px-4 border-b">{invoice.invoiceId}</td>
                        <td className="py-2 px-4 border-b">{invoice.invoiceNumber}</td>
                        <td className="py-2 px-4 border-b">{invoice.invoiceCategory}</td>
                        <td className="py-2 px-4 border-b">{invoice.issueDate}</td>
                        <td className="py-2 px-4 border-b">{invoice.paymentDate}</td>
                        <td className="py-2 px-4 border-b">{invoice.sum}</td>
                        <td className="py-2 px-4 border-b">{invoice.paid ? "Tak" : "Nie"}</td>
                        <td className="py-2 px-4 border-b">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteInvoice(invoice.invoiceId); }}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                            >
                                Usuń
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal formularza */}
            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Dodaj Fakturę</h2>
                        {/* Formularz */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imię</label>
                                <input
                                    type="text"
                                    name="tenantName"
                                    id="tenantName"
                                    value={tenantName}
                                    onChange={handleTenantChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="tenantSurname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nazwisko</label>
                                <input
                                    type="text"
                                    name="tenantSurname"
                                    id="tenantSurname"
                                    value={tenantSurname}
                                    onChange={handleTenantChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Numer Faktury</label>
                                <input
                                    type="text"
                                    name="invoiceNumber"
                                    id="invoiceNumber"
                                    value={formData.invoiceNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="invoiceCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategoria</label>
                                <select
                                    name="invoiceCategory"
                                    id="invoiceCategory"
                                    value={formData.invoiceCategory}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                >
                                    {invoiceCategories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Wystawienia</label>
                                <input
                                    type="date"
                                    name="issueDate"
                                    id="issueDate"
                                    value={formData.issueDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Płatności</label>
                                <input
                                    type="date"
                                    name="paymentDate"
                                    id="paymentDate"
                                    value={formData.paymentDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="sum" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kwota</label>
                                <input
                                    type="number"
                                    name="sum"
                                    id="sum"
                                    value={formData.sum}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="isPaid" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opłacone</label>
                                <input
                                    type="checkbox"
                                    name="isPaid"
                                    id="isPaid"
                                    checked={formData.isPaid}
                                    onChange={handleChange}
                                    className="mt-1 block"
                                />
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

            {/* Potwierdzenie usunięcia */}
            {isDeleteConfirmationVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Czy na pewno chcesz usunąć tę fakturę?</h2>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={cancelDeleteInvoice}
                                className="bg-neutral-600 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={confirmDeleteInvoice}
                                className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                Usuń
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isSuccessVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Dane zostały pomyślnie dodane!</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoicePageContent;