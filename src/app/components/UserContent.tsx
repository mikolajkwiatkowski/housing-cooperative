"use client";
import React from 'react';
import Link from "next/link";
import UserFooter from './UserFooter';
import UserNavbar from './UserNavbar';
import { FaPhone } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { IoWater } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import useAuth from "@/app/useAuth";
type Props = {};

const UserContent = (props: Props) => {
  useAuth();
  return (
      <>
        <UserNavbar />
        <div id="main-container" className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
          <main className="flex-grow p-8 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-2 mt-14">
              {/* Kafelek 1 */}
              <Link href="/payments" className="text-blue-600 font-bold dark:text-emerald-500 block">
                <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <MdPayments className='w-56 h-56 pt-5'/>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Należności do Uregulowania</h3>
                </div>
              </Link>
              {/* Kafelek 2 */}
              <Link href="/user_panel/contact" className="text-blue-600 font-bold dark:text-emerald-500  block">
                <div
                    className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <FaPhone className='w-52 h-52 pt-5'/>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Dane Kontaktowe Administracji</h3>
                </div>
              </Link>
              {/* Kafelek 3 */}
              <Link href="/user_panel/report" className="text-blue-600 font-bold dark:text-emerald-500 block">
                <div
                    className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <MdError className='w-60 h-60  pt-5'/>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Zgłoszenia Usterek i Problemów</h3>
                </div>
              </Link>
              {/* Kafelek 4 */}
              <Link href="/user_panel/readings" className="text-blue-600 font-bold dark:text-emerald-500 block">
                <div
                    className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <IoWater className='w-60 h-60'/>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Stan Wodomierzy</h3>
                </div>
              </Link>
              {/* Kafelek 5 */}
              <Link href="/user_panel/paid_invoices" className="text-blue-600 font-bold dark:text-emerald-500 block">
                <div
                    className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <FaHistory className='w-56 h-56 pt-5'/>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Historia Transakcji</h3>
                </div>
              </Link>
              {/* Kafelek 6 */}
              <Link href="/user_panel/manage_account" className="text-blue-600 font-bold dark:text-emerald-500  block">
                <div className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[24rem] w-[24rem]">
                  <FaRegUser  className='w-60 h-60' />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Ustawienia Konta Użytkownika</h3>
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