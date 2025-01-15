"use client"
import CheckAlertsContent from "@/app/components/CheckAlertsContent";
import AdminFooter from "@/app/components/AdminFooter";
import AdminNavbar from "@/app/components/AdminNavbar";
import React, { useState } from "react";
import withProtectedPage from "@/app/components/withProtectedPage";
import ProtectedPage from "@/app/components/withProtectedPage";
import CredentialsPageContent from "@/app/components/CredentialsPageContent";


const CredentialsPage: React.FC = () => {

    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <AdminNavbar/>
                <CredentialsPageContent/>
                <AdminFooter/>
            </main>
        </div>
    );
};

export default withProtectedPage(CredentialsPage);