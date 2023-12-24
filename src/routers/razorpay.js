const express = require('express')
const auth = require('../middleware/auth')
const razorpay_controller = require('../controllers/razorpay')

const router = new express.Router()

router.post('/api/order/razorpay', auth, razorpay_controller.post_razorpay_order)
router.post('/api/payment/razorpay', auth, razorpay_controller.post_razorpay_payment)
router.get("/api/recharge/history", auth, razorpay_controller.get_recharge_history)

module.exports = router
