"use client";
import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import useAuth from "@/app/useAuth";

type Invoice = {
  invoiceId: number;
  invoiceNumber: string;
  invoiceCategory: string;
  issueDate: string;
  paymentDate: string;
  sum: number;
  paid: boolean;
};

const CheckUnpaidInvoicesContent = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/api/user/unpaidinvoices", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      // Wyświetlamy tylko niezapłacone faktury
      const unpaidInvoices = data.content.filter((invoice: Invoice) => !invoice.paid);
      setInvoices(unpaidInvoices);
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd podczas ładowania danych.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleRowClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditing(true);
  };

  useAuth();

  return (
      <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
        <BackButton />
        <main className="flex-grow flex flex-col p-8">
          {isLoading && <p className="text-center text-gray-600 dark:text-white">Ładowanie...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!isLoading && !error && (
              <>
                {/* Niezapłacone faktury */}
                <section className="mt-10">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                    Niezapłacone faktury
                  </h2>
                  <div className="overflow-x-auto text-black dark:text-white">
                    <table className="w-full bg-white dark:bg-neutral-700 rounded-lg shadow-lg border-collapse">
                      <thead>
                      <tr>
                        <th className="text-center px-4 py-2">Numer faktury</th>
                        <th className="text-center px-4 py-2">Kategoria</th>
                        <th className="text-center px-4 py-2">Kwota</th>
                        <th className="text-center px-4 py-2">Data wystawienia</th>
                        <th className="text-center px-4 py-2">Data płatności</th>
                      </tr>
                      </thead>
                      <tbody>
                      {invoices.map((invoice) => (
                          <tr
                              key={invoice.invoiceId}
                              className="border-b border-gray-200 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-600 cursor-pointer"
                              onClick={() => handleRowClick(invoice)}
                          >
                            <td className="text-center px-4 py-2">{invoice.invoiceNumber}</td>
                            <td className="text-center px-4 py-2">{invoice.invoiceCategory}</td>
                            <td className="text-center px-4 py-2">{invoice.sum.toFixed(2)} zł</td>
                            <td className="text-center px-4 py-2">{invoice.issueDate}</td>
                            <td className="text-center px-4 py-2">{invoice.paymentDate}</td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Modal edycji */}
                {isEditing && selectedInvoice && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                      <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                          Szczegóły faktury
                        </h2>
                        <div className="flex flex-col gap-4">
                          <label className="text-black dark:text-white">
                            Numer faktury:
                            <input
                                type="text"
                                name="invoiceNumber"
                                value={selectedInvoice.invoiceNumber}
                                disabled
                                className="w-full mt-1 p-2 border rounded text-black"
                            />
                          </label>
                          <label className="text-black dark:text-white">
                            Kategoria:
                            <input
                                type="text"
                                name="invoiceCategory"
                                value={selectedInvoice.invoiceCategory}
                                disabled
                                className="w-full mt-1 p-2 border rounded text-black"
                            />
                          </label>
                          <label className="text-black dark:text-white">
                            Kwota:
                            <input
                                type="number"
                                name="sum"
                                value={selectedInvoice.sum}
                                disabled
                                className="w-full mt-1 p-2 border rounded text-black"
                            />
                          </label>
                          <label className="text-black dark:text-white">
                            Data wystawienia:
                            <input
                                type="text"
                                name="issueDate"
                                value={selectedInvoice.issueDate}
                                disabled
                                className="w-full mt-1 p-2 border rounded text-black"
                            />
                          </label>
                          <label className="text-black dark:text-white">
                            Data płatności:
                            <input
                                type="text"
                                name="paymentDate"
                                value={selectedInvoice.paymentDate}
                                disabled
                                className="w-full mt-1 p-2 border rounded text-black"
                            />
                          </label>
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
              </>
          )}
        </main>
      </div>
  );
};

export default CheckUnpaidInvoicesContent;
