"use client"
import React, { useState } from "react";
import AdminContent from "../components/AdminContent";


const AdminPage: React.FC = () => {

  return (
    <div className="flex flex-col bg-gray-900">
      <main className="flex-grow">
        <AdminContent/>
      </main>
    </div>
  );
};

export default AdminPage;
