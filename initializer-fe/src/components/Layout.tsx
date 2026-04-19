import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import './Layout.css';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="ids-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="ids-main">
        <header className="ids-header">
          <button className="ids-mobile-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="ids-header-content">
            <span className="ids-system-status">
              <span className="ids-status-dot"></span>
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        <main className="ids-content">
          <div className="ids-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
