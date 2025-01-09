"use client"
import ManageCooperativeContent from "@/app/components/ManageCooperativeContent";

import AdminFooter from "@/app/components/AdminFooter";
import AdminNavbar from "@/app/components/AdminNavbar";
import React, { useState } from "react";
import withProtectedPage from "@/app/components/withProtectedPage";
import ProtectedPage from "@/app/components/withProtectedPage";
import InvoicePageContent from "@/app/components/InvoicePageContent";


const InvoicePage: React.FC = () => {

    return (
        <div className="flex flex-col bg-white dark:bg-neutral-800">
            <main className="flex-grow">
                <AdminNavbar/>
                <InvoicePageContent/>
                <AdminFooter/>
            </main>
        </div>
    );
};

export default withProtectedPage(InvoicePage);
