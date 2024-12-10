// components/AdminNavbar.tsx
import React from 'react';

const AdminNavbar: React.FC = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/admin_panel" className="text-white text-lg font-bold">
              Panel Administratora
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <a
              href="/admin_panel/users"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Zarządzanie użytkownikami
            </a>
            <a
              href="/admin_panel/payments"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Zarządzanie płatnościami
            </a>
            <a
              href="/admin_panel/messages"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Wiadomości
            </a>
          </div>

          {/* Logout/Profile */}
          <div className="flex items-center space-x-4">
            <img
              src="/avatar-placeholder.png"
              alt="Avatar"
              className="h-8 w-8 rounded-full"
            />
            <a
              href="/logout"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Wyloguj
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
