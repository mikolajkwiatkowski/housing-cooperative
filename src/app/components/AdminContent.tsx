import React from 'react';
import Link from "next/link";
import AdminFooter from './AdminFooter';
import AdminNavbar from './AdminNavbar';
import { FaUser } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { IoWater } from "react-icons/io5";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaCity } from "react-icons/fa";

type Props = {};

const AdminContent = (props: Props) => {
  return (
      <>
        <div id="main-container" className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
          <main className="flex-grow p-8 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-2 mt-14">
              {/* Kafelek 1 */}
              <Link href="/admin_panel/payments" className="text-blue-600 font-bold dark:text-emerald-500 block">
                <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <FaMoneyBillTrendUp className='w-56 h-56 pt-5'/>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Zarządzanie zadłużeniami</h3>
                </div>
              </Link>
              {/* Kafelek 2 */}
              <Link href="admin_panel/manage_inhabitants" className="text-blue-600 font-bold dark:text-emerald-500 block">
                <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <FaUser className='w-56 h-56 pt-5'/>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Zarządzanie danymi mieszkańców</h3>
                </div>
              </Link>
              {/* Kafelek 3 */}
              <Link href="admin_panel/check_alerts" className="text-blue-600 font-bold dark:text-emerald-500 block">
                <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <MdError className='w-60 h-60 pt-5'/>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Zgłoszone incydenty i problemy</h3>
                </div>
              </Link>
              {/* Kafelek 4 */}
              <Link href="/admin_panel/readings" className="text-blue-600 font-bold dark:text-emerald-500 block">
                <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <IoWater className='w-60 h-60'/>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Odczyty i monitorowanie liczników</h3>
                </div>
              </Link>
              {/* Kafelek 5 */}
              <Link href="/history" className="text-blue-600 font-bold dark:text-emerald-500 block">
                <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <FaFileInvoiceDollar className='w-56 h-56 pt-6'/>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-white">Naliczenia</h3>
                </div>
              </Link>
              {/* Kafelek 6 */}
              <Link href="admin_panel/manage_cooperative" className="text-blue-600 font-bold dark:text-emerald-500 block">
                <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <FaCity className='w-60 h-60'/>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Zarządzanie zasobami spółdzielni</h3>
                </div>
              </Link>
            </div>
          </main>
        </div>
      </>
  );
};

export default AdminContent;