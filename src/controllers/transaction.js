const User = require('../models/user')
const Transaction = require('../models/transaction')
const moment = require('moment')
const { InvokeCustomError } = require('../errors/InvokeCustomError')
const conn = require('../db/mongoose')

exports.post_money_transfer = async (req, res, next) => {
    try {
        const data = req.body
        try {
            payee = await User.findByCredentials(data.payee)
            payer = await User.findByCredentials(data.payer, data.password) //double checking if user is authenticated or not
        } catch (err){
            return res.status(err.status).send({ message: err.message})
        }

        const amount = Number(data.amount)
        // if (payer.balance < amount) {
            // throw new InvokeCustomError('PayloadValidationError', "Insufficient funds to make an transfer. Reacharge now!.")
        // }
        
        if (amount <= 0 || amount > 500) {
            throw new InvokeCustomError('PayloadValidationError', 'Payable amount should be limited to 0-500 only.')
        }

        try {
            const session = await conn.startSession();
            await session.startTransaction(); 
            const transaction = new Transaction({
                amount: amount,
                note: data.note,
                debit_from: payer.id,
                credit_to: payee._id
            })
    
            await transaction.save({ session }) 
            
            payer.transactions.push(transaction._id)
            payer.balance -= amount
            await payer.save({session})
            
            payee.balance += amount
            await payee.save({session})

            await session.commitTransaction()
            return res.status(202).send({ message: `Money transfer is successful to ${payee.email}`, new_balance: payer.balance })
        } catch (err) {
            await session.abortTransaction();
            res.status(400).send({
                message: 'Transaction cannot be processed right now. Please try again later.'
            })
        } 
    } catch (err){
        next(err)
    }
}


exports.get_transfer_history = async (req, res, next) => {
    
    let payload = []
    let transData = []
    try{
        const userObj = req.user
        if (req.query.mode === 'debit') {
            transData = await Transaction.find({'_id': { $in: userObj.transactions}}).populate('credit_to', 'email').sort({createdAt: -1})
        } else {
            transData = await Transaction.find({'credit_to': { $in: userObj }}).populate('debit_from', 'email').sort({createdAt: -1})
        }

        for (let data of transData) {
            payload.push({
                'id': data._id,
                'user': req.query.mode === 'debit' ? data.credit_to.email : data.debit_from.email,
                'amount': Number(data.amount),
                'note': data.note,
                'date': moment(data.createdAt).format('MMM DD YYYY, h:mm a')
            })
        }
        return res.status(200).send(payload)
    } catch (err) {
        next(err)
    }  
}
