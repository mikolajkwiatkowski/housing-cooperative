"use client"
import React from "react";
import UserNavbar from "@/app/components/UserNavbar";
import UserFooter from "@/app/components/UserFooter";
import ReportProblemContent from "@/app/components/ReportProblemContent";
import ContactContent from "@/app/components/ContactContent";
import withProtectedPage from "@/app/components/withProtectedPage";

const ContactPage: React.FC = () => {

    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <UserNavbar/>
                    <ContactContent/>
                <UserFooter/>
            </main>
        </div>
    );
};

export default withProtectedPage(ContactPage);