const express = require('express')
const auth = require('../middleware/auth')
const transactionController = require('../controllers/transaction')

const router = new express.Router()

router.post('/v1/transfers', auth, transactionController.transfer)
router.get("/v1/transfers/history", auth, transactionController.get_transfer_history)
router.get("/v1/export/transfers/history", auth, transactionController.export_transfer_history)

module.exports = router
