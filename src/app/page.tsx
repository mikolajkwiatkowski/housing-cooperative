'use client'
import React, { useState } from "react";
import UnloggedContent from "./components/UnloggedContent";
import UnloggedFooter from "./components/UnloggedFooter";
import UnloggedNavbar from "./components/UnloggedNavbar";
import AdminNavbar from "./components/AdminNavbar";
import AdminContent from "./components/AdminContent";
import AdminFooter from "./components/AdminFooter";
import UserNavbar from "./components/UserNavbar";
import UserContent from "./components/UserContent";
import UserFooter from "./components/UserFooter";

const HomePage: React.FC = () => {
  // 3 rodzaje użytkowników: "unlogged", "user", "admin". Domyślnie "user".
  const [userRole, setUserRole] = useState<"unlogged" | "user" | "admin">("user");

  const renderContent = () => {
    switch (userRole) {
      case "admin":
        return <AdminContent />;
      case "user":
        return <UserContent />;
      default:
        return <UnloggedContent />;
    }
  };

 

  return (
    <div className="flex flex-col  bg-gray-900">
      

      {/* Content */}
      <main className="flex-grow">
        {renderContent()}
      </main>

     
    </div>
  );
};

export default HomePage;
