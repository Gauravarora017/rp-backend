const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/subscriptions/:userId', authMiddleware, subscriptionController.getSubscriptionsByUserId);
router.post('/subscribe', authMiddleware, subscriptionController.createSubscription);
router.post('/cancel-subscription', authMiddleware, subscriptionController.cancelSubscription);

module.exports = router;
