import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cpu, Network, Terminal, LogOut, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Network size={20} />, label: 'Network Discovery', path: '/network' },
    { icon: <Cpu size={20} />, label: 'USB Flashing', path: '/flashing' },
    { icon: <Terminal size={20} />, label: 'System Logs', path: '/logs' },
  ];

  return (
    <>
      <div className={`ids-sidebar-overlay ${isOpen ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`ids-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="ids-sidebar-header">
          <h2>INITIALIZER</h2>
        </div>
        
        <nav className="ids-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `ids-nav-item ${isActive ? 'is-active' : ''}`}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          <a 
            href="https://github.com/IvoDS/initializer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ids-nav-item"
            onClick={onClose}
          >
            <Github size={20} />
            <span>GitHub Repo</span>
          </a>
        </nav>

        <div className="ids-sidebar-footer">
          <button className="ids-logout-btn" onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
