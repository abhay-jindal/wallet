const mongoose = require('mongoose')

const razorpayPaymentSchema = new mongoose.Schema({
    // _id corresponds to Razorpay payment id
    _id: {
        type: String,
        // required: true,
        // unique: true,
        trim: true,
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        maxLength: 40,
        default: 'Recharge via Razorpay',
        trim: true
    },
    // amount is in INR
    amount: {
        type: Number,
        required: true,
        integer: true
    },
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
        required : true 
    },
    method: {
        type: String,
        enum: ['card', 'netbanking', 'wallet', 'emi', 'upi'],
        required : true 
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    errorDescription: {
        type: String,
        trim: true
    },
    errorCode: {
        type: String,
        trim: true 
    }
}, {
    timestamps: true
})

const RazorpayPayment = mongoose.model('RazorpayPayment', razorpayPaymentSchema)
// RazorpayPayment.createCollection();

module.exports = RazorpayPayment
