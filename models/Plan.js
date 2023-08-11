const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
  },
  monthlyPrice: {
    type: Number,
    required: true,
  },
  yearlyPrice: {
    type: Number,
    required: true,
  },
  monthlyStripePriceId: {
    type: String, // Stripe Price ID for monthly pricing
    required: true,
  },
  yearlyStripePriceId: {
    type: String, // Stripe Price ID for yearly pricing
    required: true,
  },
  videoQuality: String,
  resolution: String,
  devices: String,
  activeScreens: Number,
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
