import React from 'react';
import Link from "next/link";
import UserFooter from './UserFooter';
import UserNavbar from './UserNavbar';

type Props = {};

const UserContent = (props: Props) => {
  return (
    <>
      <UserNavbar />
      <div id="main-container" className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
        <main className="flex-grow p-8 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-2 mt-14">
            {/* Kafelek 1 */}
            <Link href="/payments" className="text-blue-600 font-bold dark:text-emerald-500 block">
              <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-white ">Zaległe płatności</h3>
                
              </div>
              </Link>
              {/* Kafelek 2 */}
              <Link href="/contact" className="text-blue-600 font-bold dark:text-emerald-500  block">
                <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-white">Kontakt</h3>
                  
                </div>
              </Link>
              {/* Kafelek 3 */}
              <Link href="/report" className="text-blue-600 font-bold dark:text-emerald-500 block">
              <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-white">Zgłoś problem</h3>
                

              </div>
              </Link>
              {/* Kafelek 4 */}
              <Link href="/readings" className="text-blue-600 font-bold dark:text-emerald-500 block">
              <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-white">Odczyty liczników</h3>
                
              </div>
              </Link>
              {/* Kafelek 5 */}
              <Link href="/history" className="text-blue-600 font-bold dark:text-emerald-500 block">
              <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-white">Historia transakcji</h3>
                
              </div>
              </Link>
              {/* Kafelek 6 */}
              <Link href="/notifications" className="text-blue-600 font-bold dark:text-emerald-500  block">
              <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-white">Powiadomienia</h3>
                 
              </div>
              </Link>
          </div>
        </main>
      </div>
      <UserFooter/>
    </>
  );
};

export default UserContent;