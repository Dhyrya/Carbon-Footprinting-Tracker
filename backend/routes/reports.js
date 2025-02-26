const express = require('express');
const { generateReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', authMiddleware, generateReport);

module.exports = router;