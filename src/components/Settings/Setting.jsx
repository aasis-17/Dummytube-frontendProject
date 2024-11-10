// src/components/Settings.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const Settings = () => {
  return (
    <div className="flex">
      {/* Left Navigation Section */}
      <nav className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <ul className="space-y-2">
          <li>
            <Link to={"/setting/accountSetting"} className="block p-2 rounded hover:bg-gray-700">
              Account Information
            </Link>
          </li>
          <li>
            <Link to={"/setting/changePassword"} className="block p-2 rounded hover:bg-gray-700">
              Change Password
            </Link>
          </li>
          <li>
            <Link to={"/setting/dashboard"} className="block p-2 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to={"/setting/deactivate"} className="block p-2 rounded hover:bg-gray-700">
              Deactivate Channel
            </Link>
          </li>
        </ul>
      </nav>

      {/* Right Content Section */}
      <div className="flex-1 p-2 bg-gray-400">
        <Outlet/>
      </div>
    </div>
  );
};

export default Settings;
