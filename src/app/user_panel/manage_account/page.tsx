"use client"
import React from "react";
import UserNavbar from "@/app/components/UserNavbar";
import UserFooter from "@/app/components/UserFooter";
import ManageAccountContent from "@/app/components/ManageAccountContent";

const ManageAccountPage: React.FC = () => {

    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <UserNavbar />
                <ManageAccountContent />
                <UserFooter />

            </main>
        </div>
    );
};

export default ManageAccountPage;