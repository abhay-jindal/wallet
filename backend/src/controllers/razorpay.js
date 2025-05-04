const { v4: uuidv4 } = require('uuid')
const Razorpay = require('razorpay')
const RazorpayPayment = require('../models/razorpayPayment')
const moment = require('moment')
const RazorpayOrder = require('../models/razorpayOrder')
const Card = require('../models/card')

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

exports.order = async (req, res, next) => {
    const amount = req.body.amount*100
    const options = {
        amount: amount,
        currency: 'INR',
        receipt: uuidv4(),
        payment_capture: 1
    }

    try {
        const raz_order = await razorpay.orders.create(options)
        const order = new RazorpayOrder({
            _id: raz_order.id,
            amount: req.body.amount,
            status: raz_order.status,
            customer: req.customer._id,
            createdAt: raz_order.created_at
        })
        await order.save();
        res.status(201).send({
            order_id: raz_order.id,
            amount: raz_order.amount
        })
    } catch(err) {
        // Razorpay only throws error named 'Error', so manually changing properties to pass to error handler middleware
        err.name = 'RazorpayCreateOrderError'
        err.httpStatus = 424
        err.message = 'Razorpay cannot process your request right now! Please try again later'
        next(err)
    }
}

exports.payment = async (req, res, next) => {
    const customer = req.customer;
    try {
        const raz_payment = await razorpay.payments.fetch(req.body.razorpayPaymentId)
    
        const payment = new RazorpayPayment({
            _id: raz_payment.id,
            razorpay_order: raz_payment.order_id,
            description: raz_payment.description,
            amount: raz_payment.amount/100, // api returning amount in paise
            status: raz_payment.status,
            method: raz_payment.method,
            customer: customer._id,
            error_description:raz_payment.error_description,
            error_code: raz_payment.error_code
        })
        await payment.save()
    
        if (raz_payment.status === 'captured') await Card.findByIdAndUpdate(customer.card, { amount: raz_payment.amount/100 })
        res.status(201).send({ message: `Your e-Wallet is recharged with amount ${raz_payment.amount/100 } via Razorpay!`})
    } catch (err) {
        next(err)
    }
}


exports.get_recharge_history = async (req, res, next) => {
    let payload = []
    try{
        const customer = req.user
        const razorData = await RazorpayPayment.find({'owner': { $in: customer }}).sort({createdAt: -1})
        
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
        next(err)
    }  
}
