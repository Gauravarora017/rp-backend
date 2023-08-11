const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const planController = require('../controllers/planController');

router.get('/plans', authMiddleware, planController.getPlans);

module.exports = router;
