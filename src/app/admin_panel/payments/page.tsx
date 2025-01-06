import React from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import AdminFooter from "@/app/components/AdminFooter";
import MenagePaymentsContent from "@/app/components/MenagePaymentsContent";

const MenagePayments: React.FC = () => {

    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <AdminNavbar/>
                <MenagePaymentsContent/>
                <AdminFooter/>
            </main>
        </div>
    );
};

export default MenagePayments;