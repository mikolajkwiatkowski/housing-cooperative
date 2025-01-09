"use client";

import React from "react";
import AdminContent from "../components/AdminContent";
import AdminNavbar from "../components/AdminNavbar";
import AdminFooter from "../components/AdminFooter";
import ProtectedPage from "@/app/components/withProtectedPage";
import withProtectedPage from "@/app/components/withProtectedPage"; // Import HOC

const AdminPage: React.FC = () => {
    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <AdminNavbar />
                <AdminContent />
                <AdminFooter />
            </main>
        </div>
    );
};

// Użycie HOC - przekazujemy komponent jako argument
export default withProtectedPage(AdminPage);
