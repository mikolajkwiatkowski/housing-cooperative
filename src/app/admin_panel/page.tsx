// src/app/admin_panel/page.tsx (Next.js 13+)

import React from 'react';

// Interfejs dla danych bloków
interface Block {
  blockId: number;
  city: string;
  street: string;
  buildingNumber: number;
  apartmentStaircasesList: any[];
}

// Funkcja asynchroniczna do pobierania danych
async function fetchBlockData(blockId: number): Promise<Block | null> {
  try {
    const response = await fetch(`http://localhost:8080/api/blocks/${blockId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:admin'), // zakładając, że używasz loginu "admin" i hasła "admin"
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
}

// Komponent strony
const Page = async () => {
  const blockId = 2; // Możesz zmienić ID na dynamiczne
  const block = await fetchBlockData(blockId);  // Pobieranie danych asynchronicznie

  if (!block) {
    return <div>Error: Unable to fetch block data.</div>;
  }

  return (
    <div>
      <h1>Street Details</h1>
      <p><strong>Street:</strong> {block.street}</p>
      <p><strong>City:</strong> {block.city}</p>
      <p><strong>Building Number:</strong> {block.buildingNumber}</p>
      <p><strong>Apartment Staircases:</strong> {block.apartmentStaircasesList.length}</p>
    </div>
  );
};

export default Page;
