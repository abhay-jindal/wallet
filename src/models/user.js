const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const { InvokeCustomError } = require('../errors/InvokeCustomError')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!/^(?=[a-zA-Z]{3,15}$)/.test(value)) {
                throw new Error('Name should consist of letters between 3 to 15 characters long.');
            }
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!/^(?=[a-zA-Z]{3,15}$)/.test(value)) {
                throw new Error('Name should consist of letters between 3 to 15 characters long.');
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email address is invalid!')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(value)) {
                throw new Error('Passwords must have upper and lower case letters, at least 1 number and special character and be at least 8 characters long.');  
            }
        }
    },
    avatar: {
        type: String,
        trim: true,
    },
    transactions:[
        {type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}
    ],
    balance: {
        type: Number,
        default: 0.0,
        integer: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true
})

userSchema.virtual('debit_from', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'debit_from'
})

userSchema.virtual('credit_to', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'credit_to'
})

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.updatedAt
    delete userObject._id
    delete userObject.transactions
    userObject.createdAt = moment(userObject.createdAt).format('MMM DD YYYY')
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30m' })
    if (user.tokens.length === 5) {
        user.tokens.splice(0, 1)
    }
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password='') => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new InvokeCustomError('AccountNotFoundError')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch && password) {
        throw new InvokeCustomError('AccountNotFoundError')
    }
    return user
}

userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
