import { useEffect, useState } from 'react';
import { socket } from '../services/socket';

export const useDevices = () => {
  const [networkDevices, setNetworkDevices] = useState<any[]>([]);
  const [usbDevices, setUsbDevices] = useState<any[]>([]);
  const [flashProgress, setFlashProgress] = useState<any>(null);
  const [initProgress, setInitProgress] = useState<any>(null);

  useEffect(() => {
    socket.on('network_devices', (devices) => setNetworkDevices(devices));
    socket.on('usb_devices', (devices) => setUsbDevices(devices));
    socket.on('flash_progress', (data) => setFlashProgress(data));
    socket.on('init_progress', (data) => setInitProgress(data));

    return () => {
      socket.off('network_devices');
      socket.off('usb_devices');
      socket.off('flash_progress');
      socket.off('init_progress');
    };
  }, []);

  const refreshNetwork = () => socket.emit('get_network_devices');
  const refreshUsb = () => socket.emit('get_usb_devices');
  const startFlash = (deviceId: string) => socket.emit('start_flash', { deviceId });
  const startInit = (deviceId: string) => socket.emit('start_init', { deviceId });

  return {
    networkDevices,
    usbDevices,
    flashProgress,
    initProgress,
    refreshNetwork,
    refreshUsb,
    startFlash,
    startInit
  };
};
