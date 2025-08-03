import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Assumes you have a Sidebar component

function PortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="flex min-h-screen font-sans text-base leading-relaxed bg-gray-100">
      <button
        type="button"
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 bg-gray-900 text-white border-none px-4 py-2 cursor-pointer transition-all duration-300 shadow ${
          sidebarOpen
            ? 'left-52 rounded-r rounded-l-none'
            : 'left-0 rounded-r rounded-l-none'
        }`}
        style={{ outline: 'none' }}
      >
        {sidebarOpen ? '<' : '☰'}
      </button>
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 p-4 overflow-y-auto min-h-screen transition-all duration-300 ml-16">
        {children}
      </div>
    </div>
  );
}

export default PortalLayout;
