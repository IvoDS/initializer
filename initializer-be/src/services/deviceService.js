const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class DeviceService {
  constructor(io) {
    this.io = io;
  }

  async getNetworkDevices() {
    try {
      const data = await fs.readFile(path.join(__dirname, '../../storage/emulation/network_devices.json'), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error reading network devices:', error);
      return [];
    }
  }

  async getUsbDevices() {
    try {
      const data = await fs.readFile(path.join(__dirname, '../../storage/emulation/usb_devices.json'), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error reading USB devices:', error);
      return [];
    }
  }

  async simulateFlashing(deviceId, socket) {
    logger.info(`Starting OS flashing for device: ${deviceId}`);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        socket.emit('flash_progress', { deviceId, progress, status: 'completed' });
        logger.info(`Flashing completed for device: ${deviceId}`);
      } else {
        socket.emit('flash_progress', { deviceId, progress, status: 'flashing' });
      }
    }, 1000);
  }

  async simulateInitialization(deviceId, socket) {
    logger.info(`Starting initialization for network device: ${deviceId}`);
    
    const steps = [
      'Connecting via SSH...',
      'Updating package repositories...',
      'Installing core dependencies...',
      'Configuring network interfaces...',
      'Starting application services...',
      'Finalizing setup...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      const progress = Math.floor(((currentStep + 1) / steps.length) * 100);
      const message = steps[currentStep];
      
      socket.emit('init_progress', { deviceId, progress, message, status: 'in_progress' });
      logger.info(`Device ${deviceId} Init: ${message}`);

      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        socket.emit('init_progress', { deviceId, progress: 100, message: 'Initialization successful', status: 'completed' });
        logger.info(`Initialization completed for device: ${deviceId}`);
      }
    }, 2000);
  }
}

module.exports = DeviceService;
