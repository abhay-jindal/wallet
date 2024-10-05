const express = require('express')
const auth = require('../middleware/auth')
const razorpayController = require('../controllers/razorpay')

const router = new express.Router()

router.post('/v1/razorpay/orders', auth, razorpayController.order)
router.post('/v1/razorpay/payments', auth, razorpayController.payment)
// router.get("/v1/recharge/history", auth, razorpay_controller.get_recharge_history)

module.exports = router
