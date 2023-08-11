const Plan = require('../models/Plan'); // Import the Plan model

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching plans' });
  }
};
