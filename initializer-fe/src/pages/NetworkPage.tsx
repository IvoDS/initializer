import React, { useEffect } from 'react';
import { Network, RefreshCw, Play, CheckCircle } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { Button } from '../components/Button';
import './DevicePages.css';

export const NetworkPage: React.FC = () => {
  const { networkDevices, initProgress, refreshNetwork, startInit } = useDevices();

  useEffect(() => {
    refreshNetwork();
  }, []);

  return (
    <div className="ids-device-page">
      <header className="ids-page-header">
        <div className="ids-header-with-action">
          <div>
            <h1>NETWORK DISCOVERY</h1>
            <p>Scan and initialize devices on the local network</p>
          </div>
          <Button variant="outline" size="sm" onClick={refreshNetwork}>
            <RefreshCw size={16} />
            RESCAN
          </Button>
        </div>
      </header>

      <div className="ids-device-list">
        {networkDevices.map((device) => (
          <div key={device.id} className="ids-device-item">
            <div className="ids-device-main">
              <div className="ids-device-icon">
                <Network size={24} />
              </div>
              <div className="ids-device-info">
                <h3>{device.hostname}</h3>
                <span className="ids-device-meta">{device.ip} • {device.type.toUpperCase()}</span>
              </div>
              <div className="ids-device-status">
                <span className="ids-badge is-online">{device.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="ids-device-actions">
              {initProgress?.deviceId === device.id ? (
                <div className="ids-progress-container">
                  <div className="ids-progress-info">
                    <span className="ids-progress-msg">{initProgress.message}</span>
                    <span className="ids-progress-percent">{initProgress.progress}%</span>
                  </div>
                  <div className="ids-progress-bar">
                    <div 
                      className="ids-progress-fill" 
                      style={{ width: `${initProgress.progress}%` }}
                    />
                  </div>
                  {initProgress.status === 'completed' && (
                    <div className="ids-success-msg">
                      <CheckCircle size={16} />
                      CONFIGURATION_VERIFIED
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => startInit(device.id)}>
                  <Play size={16} />
                  INITIALIZE
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
