import React from 'react'
import Link from "next/link";

type Props = {}

const AdminContent = (props: Props) => {
  return (
    <div><main className="flex-grow p-8 bg-gray-50 dark:bg-neutral-800">
    <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8 ">
      PANEL ADMINA
    </h1>
    <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8 ">
      PANEL ADMINA
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-xl dark:bg-neutral-900">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">Kontakt</h3>
        <p className="text-gray-600 dark:text-neutral-300">
          Skontaktuj się z nami, aby uzyskać więcej informacji.<br />
          Numer telefonu: 111 222 333<br />
          E-mail: smwyrzysk@gmail.com
        </p>
        <div className="my-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-600 dark:text-white">Nasza Lokalizacja</h3>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d474.7370430587557!2d17.273827326769!3d53.154625237250755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4703961300d97233%3A0xd434b6bd0576fd85!2sSp%C3%B3%C5%82dzielnia%20Mieszkaniowa%20Lokatorsko%20-%20W%C5%82asno%C5%9Bciowa%20w%20Wyrzysku!5e0!3m2!1spl!2spl!4v1733855644301!5m2!1spl!2spl"
            width="850"
            height="300"
            loading="lazy"
          ></iframe>
        </div>
        <Link href="/contact" className="text-blue-600 font-bold dark:text-emerald-500 mt-4 block">Przejdź do kontaktu</Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-xl dark:bg-neutral-900">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">Pierwszy raz na stronie</h3>
        <p className="text-gray-600 dark:text-neutral-300 mb-4">
          Aby skorzystać z naszego portalu, zaloguj się na konto. Dane logowania otrzymasz na adres e-mail lub pocztą. Po pierwszym logowaniu możesz zmienić hasło i dostosować dane.
        </p>
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">Jak zacząć?</h4>
          <ol className="list-decimal pl-8 text-lg space-y-2 text-gray-600 dark:text-neutral-300">
            <li>Sprawdź swoje dane logowania w e-mailu lub w przesłanym liście.</li>
            <li>Zaloguj się na stronie używając loginu i hasła.</li>
            <li>Po zalogowaniu możesz zmienić swoje hasło i dostosować dane.</li>
          </ol>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">Funkcje naszej aplikacji:</h3>
        <ul className="list-disc text-xl pl-8 space-y-2 text-gray-800 mb-2 dark:text-white">
          <li><span className="text-blue-500">🔒</span> Stan zadłużenia (zaległe płatności)</li>
          <li><span className="text-green-500">💳</span> Opłacanie śmieci itp.</li>
          <li><span className="text-red-500">📢</span> Zgłaszanie problemów</li>
          <li><span className="text-blue-600">💧</span> Wprowadzanie odczytów licznika wody</li>
        </ul>
        <div className="mt-8 mr-5 flex justify-end">
          <Link href="/login_panel" className="bg-blue-600 text-white py-2 px-6 rounded-lg text-lg font-bold hover:bg-blue-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
            Zaloguj się
          </Link>
        </div>

      </div>


    </div>
  </main>

  </div>
  )
}
export default AdminContent;