"use client"


import UserContent from "../components/UserContent";


const UserPage: React.FC = () => {

  return (
    <div className="flex flex-col bg-gray-900">
      <main className="flex-grow">
        <UserContent/>
      </main>
    </div>
  );
};

export default UserPage;
