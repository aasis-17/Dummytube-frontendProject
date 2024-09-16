// src/components/Settings.jsx
import React from 'react';

const Settings = () => {
  return (
    <div className="flex">
      {/* Left Navigation Section */}
      <nav className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <ul className="space-y-2">
          <li>
            <Link to={} className="block p-2 rounded hover:bg-gray-700">
              Account Information
            </Link>
          </li>
          <li>
            <Link to="#change-password" className="block p-2 rounded hover:bg-gray-700">
              Change Password
            </Link>
          </li>
          <li>
            <Link to="#dashboard" className="block p-2 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="#delete-channel" className="block p-2 rounded hover:bg-gray-700">
              Deactivate Channel
            </Link>
          </li>
        </ul>
      </nav>

      {/* Right Content Section */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>
        <div id="account-info">
          <h2 className="text-xl font-medium mb-2">Account Information</h2>
          {/* Content for Account Information */}
        </div>
        <div id="change-password" className="mt-6">
          <h2 className="text-xl font-medium mb-2">Change Password</h2>
          {/* Content for Change Password */}
        </div>
        <div id="dashboard" className="mt-6">
          <h2 className="text-xl font-medium mb-2">Dashboard</h2>
          {/* Content for Dashboard */} nii
        </div>
        <div id="delete-channel" className="mt-6">
          <h2 className="text-xl font-medium mb-2">Delete Channel</h2>
          {/* Content for Delete Channel */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
