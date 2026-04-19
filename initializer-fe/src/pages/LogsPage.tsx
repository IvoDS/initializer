import React, { useEffect, useState } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/Button';
import './LogsPage.css';

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/logs');
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching logs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ids-logs-page">
      <header className="ids-page-header">
        <div className="ids-header-with-action">
          <div>
            <h1>SYSTEM LOGS</h1>
            <p>Real-time audit trails and service messages</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLogs} isLoading={isLoading}>
            <RefreshCw size={16} />
            REFRESH
          </Button>
        </div>
      </header>

      <div className="ids-terminal">
        <div className="ids-terminal-header">
          <div className="ids-terminal-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="ids-terminal-title">
            <Terminal size={14} />
            <span>application.log</span>
          </div>
        </div>
        <div className="ids-terminal-content">
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <div key={i} className="ids-log-line">
                <span className="ids-log-number">{(logs.length - i).toString().padStart(3, '0')}</span>
                <span className="ids-log-text">{log}</span>
              </div>
            ))
          ) : (
            <div className="ids-log-empty">No log entries found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
