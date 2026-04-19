import React from 'react';
import { Network, Cpu, Terminal, ShieldCheck } from 'lucide-react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Network Devices', value: '3', icon: <Network size={24} />, color: 'var(--ids-sapphire)' },
    { label: 'USB Drives', value: '2', icon: <Cpu size={24} />, color: 'var(--ids-emerald)' },
    { label: 'System Uptime', value: '12d 4h', icon: <ShieldCheck size={24} />, color: '#ffd700' },
    { label: 'Active Logs', value: '142', icon: <Terminal size={24} />, color: '#ff4444' },
  ];

  return (
    <div className="ids-dashboard">
      <header className="ids-page-header">
        <h1>SYSTEM OVERVIEW</h1>
        <p>Real-time device monitoring and initialization control</p>
      </header>

      <div className="ids-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="ids-stat-card">
            <div className="ids-stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="ids-stat-info">
              <span className="ids-stat-label">{stat.label}</span>
              <span className="ids-stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ids-dashboard-grid">
        <section className="ids-dashboard-card ids-welcome-card">
          <h2>Welcome to Initializer</h2>
          <p>
            Use the sidebar to discover devices on your network or flash OS images to connected USB drives.
            All operations are monitored and logged for security and audit purposes.
          </p>
          <div className="ids-card-footer">
            <span className="ids-version">v1.0.4-stable</span>
          </div>
        </section>

        <section className="ids-dashboard-card">
          <h2>Recent Activity</h2>
          <div className="ids-activity-list">
            <div className="ids-activity-item">
              <span className="ids-activity-time">10:23:01</span>
              <span className="ids-activity-text">Admin logged into the system</span>
            </div>
            <div className="ids-activity-item">
              <span className="ids-activity-time">09:45:12</span>
              <span className="ids-activity-text">System check: All services operational</span>
            </div>
            <div className="ids-activity-item">
              <span className="ids-activity-time">Yesterday</span>
              <span className="ids-activity-text">Log rotation completed successfully</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
