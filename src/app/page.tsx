import React from "react";
import Link from "next/link";
import UnloggedNavbar from "./components/UnloggedNavbar";
import UnloggedFooter from "./components/UnloggedFooter";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <UnloggedNavbar />

      <main className="flex-grow p-8 bg-gray-50 dark:bg-neutral-800">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8 ">
          Witaj w portalu informacyjnym SM Wyrzysk!
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-neutral-300 mb-8">
          Poniżej znajdziesz podstawowe informacje o tym serwisie.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-neutral-900">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Kontakt</h3>
            <p className="text-gray-600 dark:text-neutral-300">
              Skontaktuj się z nami, aby uzyskać więcej informacji.<br />
              Numer telefonu: 111 222 333<br />
              E-mail: smwyrzysk@gmail.com

              <div className="my-8">
                <h3 className="text-2xl font-semibold mb-4">Nasza Lokalizacja</h3>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d474.7370430587557!2d17.273827326769!3d53.154625237250755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4703961300d97233%3A0xd434b6bd0576fd85!2sSp%C3%B3%C5%82dzielnia%20Mieszkaniowa%20Lokatorsko%20-%20W%C5%82asno%C5%9Bciowa%20w%20Wyrzysku!5e0!3m2!1spl!2spl!4v1733855644301!5m2!1spl!2spl" 
                width="850" 
                height="300" 
                loading="lazy" 
                ></iframe>
              </div>


            </p>
            <Link href="/contact" className="text-blue-600 font-bold dark:text-emerald-500 mt-4 block">Przejdź do kontaktu</Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-neutral-900">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Informacje</h3>
            <p className="text-gray-600 dark:text-neutral-300">
              Dowiedz się więcej o funkcjonowaniu naszej wspólnoty mieszkaniowej.

            </p>
            <Link href="/info" className="text-blue-600 font-bold dark:text-emerald-500 mt-4 block">Przejdź do informacji</Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <UnloggedFooter />
    </div>
  );
};

export default HomePage;
