const express = require('express')
const cors = require('cors')
require('./src/db/mongoose')
const userRouter = require('./src/routers/user')
const transactionRouter = require('./src/routers/transaction')
const razorpayRouter = require('./src/routers/razorpay')
const { errors } = require('./src/errors/InvokeCustomError')
const fileUpload = require('express-fileupload');

const app = express()


app.use(express.json())
app.use(fileUpload()); // Don't forget this line!

// Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS 
? process.env.WHITELISTED_DOMAINS.split(',')
: []

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS policy'))
        }
    },
    credentials: true
}
app.use(cors(corsOptions))
app.use(userRouter)
app.use(transactionRouter)
app.use(razorpayRouter)

/**
* Configures and send appropriate HTTP errors codes and information for repeat
* error cases throughout the application.
*
* @function errorHandler
* @param err An error object
* @param req EpressJS req object
* @param res ExpressJS res object
* @param next ExpressJS next function
*/
function errorHandler(err, req, res, next) {
    if (err.name in errors) {
        const error = errors[err.name]
        const message = err.name === 'ValidationError' ? error.message(err) : error.message
        
        return res.status(error.httpStatus).send({
            message: message
        })
    }
    
    res.status(500).send({
        message: 'Internal server error! Please try again later.'
    })
}

app.use(errorHandler)

module.exports = app
