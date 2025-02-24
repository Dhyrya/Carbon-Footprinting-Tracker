
const express = require('express');
const { addEmissionData, getEmissionData } = require('../controllers/dataController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, addEmissionData);
router.get('/', authMiddleware, getEmissionData);

module.exports = router;
