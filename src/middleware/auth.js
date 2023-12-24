const jwt = require('jsonwebtoken')
const User = require('../models/user')
const InvokeCustomError = require('../errors/InvokeCustomError')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '').split(',')[0]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        
        if (!user) {
            throw new InvokeCustomError('AccountNotAuthorizeError')
        }

        req.token = token
        req.user = user
        next()
    } catch {
        res.status(401).send()
    }
}

module.exports = auth
