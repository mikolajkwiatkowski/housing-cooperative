"use client"
import UnloggedContent from "./components/UnloggedContent";

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
