"use client";

import React from "react";
import UserContent from "../components/UserContent";
import withProtectedPage from "@/app/components/withProtectedPage";


const UserPage: React.FC = () => {
    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <UserContent />
            </main>
        </div>
    );
};

export default withProtectedPage(UserPage)