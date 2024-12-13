"use client"
import React, { useState } from "react";
import AdminContent from "../components/AdminContent";
import AdminNavbar from "../components/AdminNavbar";
import AdminFooter from "../components/AdminFooter";


const AdminPage: React.FC = () => {

  return (
    <div className="flex flex-col bg-gray-900">
      <main className="flex-grow">
      <AdminNavbar />

        <AdminContent/>

      <AdminFooter/>

      </main>
    </div>
  );
};

export default AdminPage;
