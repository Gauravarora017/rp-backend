const Stripe = require("stripe"); // Import the Stripe library
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

exports.getSubscriptionsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const subscriptions = await Subscription.find({ user: userId }).populate(
      "plan"
    );
    if (!subscriptions) {
      return res.status(404).json({ error: "Subscriptions not found" });
    }

    res.json(subscriptions[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subscriptions" });
  }
};

exports.createSubscription = async (req, res) => {
  const { userId, planId, billingInterval, paymentMethodId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Creates Stripe customer if the user doesn't have a stripeCustomerId
    if (!user.stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });

      user.stripeCustomerId = stripeCustomer.id;
      await user.save();
    }

    const stripePriceId =
      billingInterval === "monthly"
        ? plan.monthlyStripePriceId
        : plan.yearlyStripePriceId;

    // Create subscription on Stripe
    const subscription = await stripe.subscriptions.create({
      customer: user.stripeCustomerId,
      items: [{ price: stripePriceId }],
      default_payment_method: paymentMethodId,
      billing:
        billingInterval === "monthly" ? "charge_automatically" : "send_invoice",
      days_until_due: billingInterval === "monthly" ? 7 : null, // If sending invoice
    });

    // Save subscription details in database
    const newSubscription = await Subscription.create({
      userId,
      planId,
      billingInterval,
      subscriptionId: subscription.id,
      isActive: true,
    });

    res.status(201).json({
      message: "Subscription created successfully",
      subscription: newSubscription,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating subscription" });
  }
};

exports.cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.params;

  try {
    // Find the subscription in the database
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    // Cancel subscription on Stripe
    await stripe.subscriptions.del(subscription.stripeSubscriptionId);

    // Update subscription status in database
    await Subscription.findByIdAndUpdate(subscriptionId, { isActive: false });

    res.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error canceling subscription" });
  }
};
