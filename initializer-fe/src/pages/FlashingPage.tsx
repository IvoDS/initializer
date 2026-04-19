import React, { useEffect } from 'react';
import { Cpu, RefreshCw, Zap, CheckCircle } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { Button } from '../components/Button';
import './DevicePages.css';

export const FlashingPage: React.FC = () => {
  const { usbDevices, flashProgress, refreshUsb, startFlash } = useDevices();

  useEffect(() => {
    refreshUsb();
  }, []);

  return (
    <div className="ids-device-page">
      <header className="ids-page-header">
        <div className="ids-header-with-action">
          <div>
            <h1>USB FLASHING</h1>
            <p>Write OS images to connected industrial drives</p>
          </div>
          <Button variant="outline" size="sm" onClick={refreshUsb}>
            <RefreshCw size={16} />
            REFRESH
          </Button>
        </div>
      </header>

      <div className="ids-device-list">
        {usbDevices.map((device) => (
          <div key={device.id} className="ids-device-item">
            <div className="ids-device-main">
              <div className="ids-device-icon">
                <Cpu size={24} />
              </div>
              <div className="ids-device-info">
                <h3>{device.label}</h3>
                <span className="ids-device-meta">{device.path} • {device.capacity}</span>
              </div>
              <div className="ids-device-status">
                <span className="ids-badge is-ready">{device.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="ids-device-actions">
              {flashProgress?.deviceId === device.id ? (
                <div className="ids-progress-container">
                  <div className="ids-progress-info">
                    <span className="ids-progress-msg">
                      {flashProgress.status === 'completed' ? 'Flashing complete' : 'Writing OS Image...'}
                    </span>
                    <span className="ids-progress-percent">{flashProgress.progress}%</span>
                  </div>
                  <div className="ids-progress-bar">
                    <div 
                      className="ids-progress-fill" 
                      style={{ width: `${flashProgress.progress}%` }}
                    />
                  </div>
                  {flashProgress.status === 'completed' && (
                    <div className="ids-success-msg">
                      <CheckCircle size={16} />
                      IMAGE_VERIFIED_SUCCESS
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="primary" size="sm" onClick={() => startFlash(device.id)}>
                  <Zap size={16} />
                  FLASH IMAGE
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
