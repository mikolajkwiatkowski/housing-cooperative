import React from "react";
import UserNavbar from "@/app/components/UserNavbar";
import UserFooter from "@/app/components/UserFooter";
import ReportProblemContent from "@/app/components/ReportProblemContent";

const ReportPage: React.FC = () => {

    return (
        <div className="flex flex-col bg-gray-900">
            <main className="flex-grow">
                <UserNavbar/>
                <ReportProblemContent/>
                <UserFooter/>
            </main>
        </div>
    );
};

export default ReportPage;