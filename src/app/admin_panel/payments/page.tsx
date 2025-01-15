"use client"
import React from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import AdminFooter from "@/app/components/AdminFooter";
import ManagePaymentsContent from "@/app/components/ManagePaymentsContent";
import withProtectedPage from "@/app/components/withProtectedPage";

const ManagePayments: React.FC = () => {

    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <AdminNavbar/>
                <ManagePaymentsContent/>
                <AdminFooter/>
            </main>
        </div>
    );
};

export default withProtectedPage(ManagePayments);