const express = require('express')
const auth = require('../middleware/auth')
const customerController = require('../controllers/customer')


const router = new express.Router()

router.post('/v1/customer/add', customerController.addCustomer)
router.post('/v1/customer/get', customerController.getCustomer)
// router.post('/api/logout', auth, user_controller.post_logout)
// router.get("/api/search/user", auth, user_controller.get_search_users)
// router.patch("/api/update/account", auth, user_controller.patch_user_account)

module.exports = router
