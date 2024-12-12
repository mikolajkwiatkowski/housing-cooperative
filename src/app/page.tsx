"use client"
import React, { useState } from "react";
import UnloggedContent from "./components/UnloggedContent";
import AdminContent from "./components/AdminContent";
import UserContent from "./components/UserContent";
import UnloggedNavbar from "./components/UnloggedNavbar";
import UnloggedFooter from "./components/UnloggedFooter";

const HomePage: React.FC = () => {

  return (
    <div className="flex flex-col bg-gray-900">
      <main className="flex-grow">
        <UnloggedContent/>
      </main>
    </div>
  );
};

export default HomePage;
