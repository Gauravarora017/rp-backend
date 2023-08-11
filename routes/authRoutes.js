const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/user/:userId', authMiddleware, authController.getUserById);
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
