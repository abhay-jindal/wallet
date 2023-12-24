const { v4: uuidv4 } = require('uuid')
const Razorpay = require('razorpay')
const RazorpayPayment = require('../models/razorpayPayment')
const moment = require('moment')

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET
})

exports.post_razorpay_order = async (req, res, next) => {
    const amount = req.body.amount*100
    const options = {
        amount: amount,
        currency: 'INR',
        receipt: uuidv4(),
        payment_capture: 1
    }
    console.log(options)

    try {
        const response = await razorpay.orders.create(options)
        console.log(response)
        res.status(201).send({
            order_id: response.id,
            amount: response.amount
        })
    } catch(err) {
        console.log(err)
        // Razorpay only throws error named 'Error', so manually changing properties to pass to error handler middleware
        err.name = 'RazorpayCreateOrderError'
        err.httpStatus = 424
        err.message = 'Razorpay cannot process your request right now! Please try again later'
        next(err)	
    }
}

exports.post_razorpay_payment = async (req, res) => {
    const userObj = req.user
    const resp = await razorpay.payments.fetch(req.body.razorpay_payment_id)
    
    const data = {
        _id: resp.id,
        razorpayOrderId: resp.order_id,
        description: resp.description,
        amount: resp.amount/100, // api returning amount in paise
        status: resp.status,
        method: resp.method,
        owner: userObj._id,
        errorDescription:resp.error_description,
        errorCode: resp.error_code
    }

    const payment = new RazorpayPayment(data)
    await payment.save()

    if (resp.status === 'captured') {
        userObj.balance += resp.amount/100
    }
    
    await userObj.save()
    res.status(201).send('Sucess!')
}


exports.get_recharge_history = async (req, res, next) => {
    
    let payload = []
    try{
        const userObj = req.user
        const razorData = await RazorpayPayment.find({'owner': { $in: userObj }}).sort({createdAt: -1})
        
        for (let data of razorData) {
            payload.push({
                'payment_id': data._id,
                'order_id': data.razorpayOrderId,
                'amount': Number(data.amount),
                'status': data.status,
                'method': data.method,
                'error_description': data.errorDescription,
                'date': moment(data.createdAt).format('MMM DD YYYY, h:mm a')
            })
        }
        return res.status(200).send(payload)
    } catch (err) {
        console.log(err)
        next(err)
    }  
}
