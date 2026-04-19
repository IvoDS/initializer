const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/database');
const User = require('./models/User');
const logger = require('./utils/logger');
const DeviceService = require('./services/deviceService');

dotenv.config();

const app = express();

// Manual "Nuclear" CORS - Sets headers for EVERY request
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
});

const deviceService = new DeviceService(io);

app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/logs', require('./routes/logs'));

// Serve Static Frontend Files
// We assume 'public' folder contains the built 'dist' from the frontend
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

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

// SPA Routing fallback: Serve index.html for all remaining requests
app.use((req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.sync();
    logger.info('Database synced');

    // Seed admin user if not exists
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';

    const adminExists = await User.findOne({ where: { username: adminUser } });
    if (!adminExists) {
      await User.create({
        username: adminUser,
        password: adminPass,
      });
      logger.info(`Admin user created: ${adminUser}`);
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
