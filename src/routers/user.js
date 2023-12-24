const express = require('express')
const auth = require('../middleware/auth')
const user_controller = require('../controllers/user')


const router = new express.Router()

router.post('/api/register', user_controller.post_register)
router.post('/api/login', user_controller.post_login)
router.post('/api/logout', auth, user_controller.post_logout)
router.get("/api/search/user", auth, user_controller.get_search_users)
router.get("/api/account", auth, user_controller.get_user_account)
router.patch("/api/update/account", auth, user_controller.patch_user_account)

module.exports = router
