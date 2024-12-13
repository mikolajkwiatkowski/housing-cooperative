"use client"
import ManageInhabitantsContent from "@/app/components/ManageInhabitantsContent";
import AdminFooter from "@/app/components/AdminFooter";
import AdminNavbar from "@/app/components/AdminNavbar";
import React, { useState } from "react";


const ManageInhabitantsPage: React.FC = () => {

  return (
    <div className="flex flex-col bg-gray-900">
      <main className="flex-grow">
        <AdminNavbar/>
            <ManageInhabitantsContent/>
        <AdminFooter/>
      </main>
    </div>
  );
};

export default ManageInhabitantsPage;
