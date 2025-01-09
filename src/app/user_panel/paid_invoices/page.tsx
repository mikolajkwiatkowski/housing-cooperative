"use client"
import React from "react";
import UserNavbar from "@/app/components/UserNavbar";
import UserFooter from "@/app/components/UserFooter";
import ReportProblemContent from "@/app/components/ReportProblemContent";
import ContactContent from "@/app/components/ContactContent";
import PaidInvoicesContent from "@/app/components/PaidInvoicesContent";
import withProtectedPage from "@/app/components/withProtectedPage";

const PaidInoivcesPage: React.FC = () => {

    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <UserNavbar/>
                    <PaidInvoicesContent/>
                <UserFooter/>
            </main>
        </div>
    );
};

export default withProtectedPage(PaidInoivcesPage);