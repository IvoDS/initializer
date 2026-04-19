const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const User = require('./models/User');
const logger = require('./utils/logger');
const DeviceService = require('./services/deviceService');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production
  },
});

const deviceService = new DeviceService(io);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Socket.io connection
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('get_network_devices', async () => {
    const devices = await deviceService.getNetworkDevices();
    socket.emit('network_devices', devices);
  });

  socket.on('get_usb_devices', async () => {
    const devices = await deviceService.getUsbDevices();
    socket.emit('usb_devices', devices);
  });

  socket.on('start_flash', async ({ deviceId }) => {
    await deviceService.simulateFlashing(deviceId, socket);
  });

  socket.on('start_init', async ({ deviceId }) => {
    await deviceService.simulateInitialization(deviceId, socket);
  });
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.sync();
    logger.info('Database synced');

    // Seed admin user if not exists
    const adminExists = await User.findOne({ where: { username: process.env.ADMIN_USER } });
    if (!adminExists) {
      await User.create({
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_PASS,
      });
      logger.info('Admin user created');
    }

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, server, io };
