const errors = {
    ValidationError: {
        httpStatus: 400,
        code: 'ValidationError',
        message: (err) => {
            const errors = {}
            Object.values(err.errors).map(val =>
                errors[val.path] = val.message
            )
            return errors
        }
    },
    MongoError: {
        httpStatus: 400,
        code: 'MongoError',
        message: 'Another user with this username/email already exists.'
    },
    MongoNetworkError: {
        httpStatus: 500,
        code: 'MongoNetworkError',
        message: 'Internal server error! Please try again later.'
    },

    // custom errors
    AccountNotFoundError: {
        httpStatus: 400,
        code: 'AccountNotFoundError',
        message: 'Sorry, we couldn\'t find an account with that username or password is incorrect.'
    },
    AccountNotAuthorizeError: {
        httpStatus: 401,
        code: 'AccountNotAuthorizeError',
        message: 'Session has been expired!! Login to continue.'
    },
    PayloadValidationError: {
        httpStatus: 416,
        code: 'PayloadValidationError',
    },
    AccountUpdateNotValidError: {
        httpStatus: 400,
        code: 'AccountUpdateNotValidError',
        message: 'Invalid updates! Please try again with new values to update.'

    },
    AccountAvatarUploadError: {
        httpStatus: 500,
        code: 'AccountAvatarUploadError',
        message: 'Avatar cannot be uploaded right now! Please try again later'
    },
    RazorpayCreateOrderError: {
        httpStatus: 424,
        code: 'RazorpayCreateOrderError',
        message: 'Razorpay cannot process your request right now! Please try again later.'
    },
}

class InvokeCustomError extends Error {
    constructor (code, description='') {
        const { httpStatus, message } = errors[code]

        super(description ? description : message)
        Error.captureStackTrace(this, this.constructor);
    
        this.name = code
        this.httpStatus = httpStatus
    }
}

module.exports = { InvokeCustomError, errors }