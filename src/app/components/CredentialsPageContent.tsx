"use client";
import React, { useState, useEffect } from "react";

const CredentialsPageContent: React.FC = () => {
    const [tenantsWithoutUser, setTenantsWithoutUser] = useState([]);
    const [tenantsWithUser, setTenantsWithUser] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState<{ email: string, tenantId: number } | null>(null);
    const [formData, setFormData] = useState({ firstName: "", email: "", password: "", tenantId: 0 });
    const [passwordFormData, setPasswordFormData] = useState({ email: "", newPassword: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchTenantsWithoutUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Brak tokena w lokalnej pamięci");
                }

                const response = await fetch("http://localhost:8080/api/admin/tenantsWithoutUser", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Nie udało się pobrać najemców bez użytkownika");
                }

                const data = await response.json();
                setTenantsWithoutUser(data);
            } catch (error) {
                console.error("Błąd podczas pobierania najemców bez użytkownika:", error);
            }
        };

        const fetchTenantsWithUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Brak tokena w lokalnej pamięci");
                }

                const response = await fetch("http://localhost:8080/api/admin/tenantsWithUser", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Nie udało się pobrać najemców z użytkownikiem");
                }

                const data = await response.json();
                setTenantsWithUser(data.content);
            } catch (error) {
                console.error("Błąd podczas pobierania najemców z użytkownikiem:", error);
            }
        };

        fetchTenantsWithoutUser();
        fetchTenantsWithUser();
    }, []);

    const handleAddAccount = (tenantId: number, email: string) => {
        setSelectedTenant({ tenantId, email });
        setFormData({ firstName: "", email, password: "", tenantId });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordFormData({ ...passwordFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Brak tokena w lokalnej pamięci");
            }
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Nie udało się zarejestrować najemcy");
            }

            alert("Najemca zarejestrowany pomyślnie");
            window.location.reload();
        } catch (error) {
            console.error("Błąd podczas rejestracji najemcy:", error);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Brak tokena w lokalnej pamięci");
            }
            const response = await fetch("http://localhost:8080/api/user/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(passwordFormData)
            });

            if (response.ok) {
                setSuccessMessage("Hasło zostało zmienione pomyślnie.");
                setErrorMessage("");
                setPasswordFormData({ email: "", newPassword: "" });
            } else {
                const errorData = await response.text();
                setErrorMessage(`Błąd: ${errorData}`);
                setSuccessMessage("");
            }
        } catch (error) {
            setErrorMessage("Wystąpił błąd podczas zmiany hasła.");
            setSuccessMessage("");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg">
            <div className="flex flex-row justify-between">
                <div className="w-1/2 pr-4">
                    <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">Najemcy Bez Kont Użytkowników</h2>
                    <table className="min-w-full bg-white dark:bg-neutral-800 text-black dark:text-white">
                        <caption className="text-lg font-semibold mb-2">Najemcy Bez Kont Użytkowników</caption>
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Imię</th>
                            <th className="py-2 px-4 border-b text-left">Nazwisko</th>
                            <th className="py-2 px-4 border-b text-left">Email</th>
                            <th className="py-2 px-4 border-b text-left">Akcja</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tenantsWithoutUser.map((tenant) => (
                            <React.Fragment key={tenant.tenantId}>
                                <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                                    <td className="py-2 px-4 border-b">{tenant.name}</td>
                                    <td className="py-2 px-4 border-b">{tenant.surname}</td>
                                    <td className="py-2 px-4 border-b">{tenant.mail}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                            onClick={() => handleAddAccount(tenant.tenantId, tenant.mail)}
                                        >
                                            Dodaj konto
                                        </button>
                                    </td>
                                </tr>
                                {selectedTenant && selectedTenant.tenantId === tenant.tenantId && (
                                    <tr>
                                        <td colSpan={4} className="py-2 px-4 border-b">
                                            <div className="mt-8">
                                                <h3 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Dodaj Konto dla {selectedTenant.email}</h3>
                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    <div>
                                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imię</label>
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            id="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            id="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hasło</label>
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            id="password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mt-6 flex justify-end gap-4">
                                                        <button
                                                            onClick={() => setSelectedTenant(null)}
                                                            className="bg-neutral-600 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg"
                                                        >
                                                            Anuluj
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                                        >
                                                            Zapisz Konto
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-1/2 pl-4">
                    <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">Najemcy Z Kontami Użytkowników</h2>
                    <table className="min-w-full bg-white dark:bg-neutral-800 text-black dark:text-white">
                        <caption className="text-lg font-semibold mb-2">Najemcy Z Kontami Użytkowników</caption>
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Imię</th>
                            <th className="py-2 px-4 border-b text-left">Nazwisko</th>
                            <th className="py-2 px-4 border-b text-left">Email</th>
                            <th className="py-2 px-4 border-b text-left">Akcja</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tenantsWithUser.map((tenant) => (
                            <React.Fragment key={tenant.tenantId}>
                                <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                                    <td className="py-2 px-4 border-b">{tenant.name}</td>
                                    <td className="py-2 px-4 border-b">{tenant.surname}</td>
                                    <td className="py-2 px-4 border-b">{tenant.mail}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                            onClick={() => setPasswordFormData({ email: tenant.mail, newPassword: "" })}
                                        >
                                            Zmień Hasło
                                        </button>
                                    </td>
                                </tr>
                                {passwordFormData.email === tenant.mail && (
                                    <tr>
                                        <td colSpan={4} className="py-2 px-4 border-b">
                                            <div className="mt-8">
                                                <h3 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Zmień Hasło dla {tenant.mail}</h3>
                                                <form onSubmit={handleChangePassword} className="space-y-6">
                                                    <div>
                                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nowe Hasło</label>
                                                        <input
                                                            type="password"
                                                            name="newPassword"
                                                            id="newPassword"
                                                            value={passwordFormData.newPassword}
                                                            onChange={handlePasswordChange}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mt-6 flex justify-end gap-4">
                                                        <button
                                                            onClick={() => setPasswordFormData({ email: "", newPassword: "" })}
                                                            className="bg-neutral-600 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg"
                                                        >
                                                            Anuluj
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="bg-blue-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                                        >
                                                            Zmień Hasło
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CredentialsPageContent;