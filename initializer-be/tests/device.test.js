const { server } = require('../src/index');
const Client = require('socket.io-client');
const sequelize = require('../src/config/database');

describe('Device Emulation Socket API', () => {
  let io, clientSocket;

  beforeAll((done) => {
    server.listen(() => {
      const port = server.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });
  });

  afterAll(async () => {
    clientSocket.close();
    server.close();
    await sequelize.close();
  });

  it('should receive network devices', (done) => {
    clientSocket.emit('get_network_devices');
    clientSocket.on('network_devices', (devices) => {
      expect(Array.isArray(devices)).toBe(true);
      expect(devices.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should receive usb devices', (done) => {
    clientSocket.emit('get_usb_devices');
    clientSocket.on('usb_devices', (devices) => {
      expect(Array.isArray(devices)).toBe(true);
      expect(devices.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should receive flashing progress', (done) => {
    clientSocket.emit('start_flash', { deviceId: 'usb-001' });
    clientSocket.on('flash_progress', (data) => {
      expect(data.deviceId).toBe('usb-001');
      expect(data).toHaveProperty('progress');
      if (data.status === 'completed' || data.progress > 0) {
        clientSocket.off('flash_progress');
        done();
      }
    });
  }, 10000);
});
