"use client"
import React from "react";
import UserNavbar from "@/app/components/UserNavbar";
import UserFooter from "@/app/components/UserFooter";
import ReadingsContent from "@/app/components/ReadingsContent";
import withProtectedPage from "@/app/components/withProtectedPage";
import PaymentContent from "@/app/components/PaymentContent";

const ReadingsPage: React.FC = () => {

    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <UserNavbar/>
                <PaymentContent/>
                <UserFooter/>
            </main>
        </div>
    );
};

export default withProtectedPage(ReadingsPage);