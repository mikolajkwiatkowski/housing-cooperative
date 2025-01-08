"use client"
import AddNotificationContent from "@/app/components/AddNotificationContent";
import AdminFooter from "@/app/components/AdminFooter";
import AdminNavbar from "@/app/components/AdminNavbar";
import React, { useState } from "react";
import withProtectedPage from "@/app/components/withProtectedPage";
import ProtectedPage from "@/app/components/withProtectedPage";


const NotifiactionPage: React.FC = () => {

  return (
    <div className="flex flex-col bg-gray-900">
      <main className="flex-grow">
        <AdminNavbar/>
            <AddNotificationContent/>
        <AdminFooter/>
      </main>
    </div>
  );
};

export default withProtectedPage(NotifiactionPage);
