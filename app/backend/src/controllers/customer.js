const Customer = require('../models/customer');
const { InvokeCustomError } = require('../errors/InvokeCustomError');
const { default: axios } = require('axios');

SECRET_KEY = '6LeZuXEpAAAAAFsJdtc3Qh3_JVDv7k8orAZDUVur'

exports.addCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByCredentials(req.body.email)
        if (customer) throw new InvokeCustomError('MongoError')
        const newCustomer = new Customer(req.body)

        await newCustomer.save()
        res.status(201).send()
    } catch (err) {
        next(err)
    }
}

exports.getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByCredentials(req.body.email, req.body.password)
        if (!customer) throw new InvokeCustomError('AccountNotFoundError');
        const token = await customer.generateAuthToken();
        res.send({ customer, token })
    } catch (err) {
        next(err)
    }
}

exports.get_search_users = async (req, res, next) => {
    try {
        const keyword = req.query.keyword
        const email = req.user.email
    
        let userObj = await User.find({email: {$regex: `^${keyword}`}}).limit(10).select('email -_id')
        if (!userObj.length) return res.status(204).send([])

        userObj = userObj.filter(user => user.email !== email )
        let data = userObj.map(user => user.email )
        res.status(200).send(data)  
    } catch (err) {
        next(err)
    }
}

exports.post_logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (err) {
       next(err)
    }
}
