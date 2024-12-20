import React from 'react';
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import UserFooter from './UserFooter';
import UserNavbar from './UserNavbar';
import Link from "next/link";
import BackButton from './BackButton';

type Contact = {
  name: string;
  position: string;
  phone: string;
  email: string;
};

const contacts: Contact[] = [
  {
    name: "Jan Kowalski",
    position: "Prezes Zarządu",
    phone: "+48 123 456 789",
    email: "jan.kowalski@spoldzielnia.pl",
  },
  {
    name: "Anna Nowak",
    position: "Kierownik Administracji",
    phone: "+48 987 654 321",
    email: "anna.nowak@spoldzielnia.pl",
  },
  {
    name: "Piotr Wiśniewski",
    position: "Specjalista ds. Technicznych",
    phone: "+48 456 789 123",
    email: "piotr.wisniewski@spoldzielnia.pl",
  },
  {
    name: "Maria Zielińska",
    position: "Dział Obsługi Klienta",
    phone: "+48 654 321 987",
    email: "maria.zielinska@spoldzielnia.pl",
  },
];

const ContactContent: React.FC = () => {
  return (
    <>
      <div id="main-container" className="flex flex-col bg-gray-100 dark:bg-neutral-800 min-h-screen">
        <BackButton/>
        <main className="flex-grow p-8 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 gap-y-1 ">
            {contacts.map((contact, index) => (
              <div key={index} className="bg-white hover:bg-stone-200 p-6 rounded-lg shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-700 flex flex-col items-center justify-between h-[20rem] w-[20rem]">
                <IoPerson className="w-32 h-32 pt-5 text-blue-600 dark:text-emerald-500" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">{contact.name}</h3>
                <p className="text-lg text-gray-600 mb-2 dark:text-gray-300">{contact.position}</p>
                <div className="flex flex-col items-center">
                  <a href={`tel:${contact.phone}`} className="text-blue-600  dark:text-emerald-300 flex items-center mb-2">
                    <FaPhone className="mr-2" /> {contact.phone}
                  </a>
                  <a href={`mailto:${contact.email}`} className="dark:text-emerald-500 text-blue-600 flex items-center">
                    <MdEmail className="mr-2" /> {contact.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ContactContent;
