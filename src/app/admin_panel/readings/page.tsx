"use client"
import ManageReadingsContent from "@/app/components/ManageReadingsContent";
import AdminFooter from "@/app/components/AdminFooter";
import AdminNavbar from "@/app/components/AdminNavbar";
import React, { useState } from "react";


const ManageReadings: React.FC = () => {

    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <AdminNavbar/>
                <ManageReadingsContent/>
                <AdminFooter/>
            </main>
        </div>
    );
};

export default ManageReadings;
