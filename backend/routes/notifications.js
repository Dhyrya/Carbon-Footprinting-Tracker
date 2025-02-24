const express = require('express');
const { checkThreshold } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/check', authMiddleware, checkThreshold);

module.exports = router;