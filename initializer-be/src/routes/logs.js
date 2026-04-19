const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', authMiddleware, (req, res) => {
  const logDir = path.join(__dirname, '../../logs');
  
  try {
    const files = fs.readdirSync(logDir)
      .filter(file => file.endsWith('.log'))
      .sort()
      .reverse();

    if (files.length === 0) {
      return res.json([]);
    }

    // Read the most recent log file
    const latestLog = path.join(logDir, files[0]);
    const content = fs.readFileSync(latestLog, 'utf8');
    
    // Parse logs (simple line split)
    const logs = content.split('\n')
      .filter(line => line.trim() !== '')
      .reverse()
      .slice(0, 100); // Return last 100 lines

    res.json(logs);
  } catch (error) {
    logger.error('Error reading logs:', error);
    res.status(500).json({ message: 'Error reading logs' });
  }
});

module.exports = router;
