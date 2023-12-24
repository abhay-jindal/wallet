const express = require('express')
const auth = require('../middleware/auth')
const transaction_controller = require('../controllers/transaction')

const router = new express.Router()

router.post('/api/transfer', auth, transaction_controller.post_money_transfer)
router.get("/api/transfer/history", auth, transaction_controller.get_transfer_history)

module.exports = router
