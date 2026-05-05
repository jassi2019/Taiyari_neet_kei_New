const express = require("express");

const router = express.Router();

const createV1 = require("../../controllers/subscription/create");
const createOrderV1 = require("../../controllers/subscription/create.order");
const createAppleIapV1 = require("../../controllers/subscription/create.apple.iap");
const authMiddleware = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Subscription related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         orderId:
 *           type: string
 *         paymentId:
 *           type: string
 *         amount:
 *           type: number
 *         paymentStatus:
 *           type: string
 *         platform:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/subscriptions:
 *   post:
 *     tags: [Subscription]
 *     summary: Create a subscription
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The orderId of the subscription
 *               signature:
 *                 type: string
 *                 description: The signature of the subscription
 *               paymentId:
 *                 type: string
 *                 description: The paymentId of the subscription
 *               planId:
 *                 type: string
 *                 description: The planId of the subscription
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/subscriptions/create-order:
 *   post:
 *     tags: [Subscription]
 *     summary: Create an order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: string
 *                 description: The planId of the subscription
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */

router.route("/").post(authMiddleware, createV1);
router.route("/create-order").post(authMiddleware, createOrderV1);
router.route("/iap/apple").post(authMiddleware, createAppleIapV1);

// Admin-only: grant premium by email
const { isAdminRole } = require("../../middlewares/auth.z");
const { User, Subscription, Plan } = require("../../models");
router.route("/admin/grant").post(authMiddleware, isAdminRole, async (req, res, next) => {
  try {
    const { email, planId } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const plan = planId
      ? await Plan.findByPk(planId)
      : await Plan.findOne({ order: [["validUntil", "DESC"]] });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Remove old subscriptions for this user first
    await Subscription.destroy({ where: { userId: user.id } });

    const sub = await Subscription.create({
      userId: user.id,
      planId: plan.id,
      startDate: new Date(),
      endDate: plan.validUntil,
      paymentId: "ADMIN_GRANT",
      orderId: "ADMIN_GRANT",
      signature: "ADMIN_GRANT",
      amount: plan.amount || 1,
      paymentStatus: "SUCCESS",
      platform: "RAZORPAY",
      notes: "Granted by admin",
    });

    return res.status(201).json({ message: "Premium granted", data: { user: { id: user.id, email: user.email, name: user.name }, subscription: sub } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
