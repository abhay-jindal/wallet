const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        integer: true
    },
    note: {
        type: String,
        maxLength: 30,
        default: 'Transfer successful!'
    },
    debit_from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    credit_to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema)
Transaction.createCollection();

module.exports = Transaction
