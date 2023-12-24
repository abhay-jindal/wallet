const User = require('../models/user')
const fs = require('fs')
const path = require('path');
const { InvokeCustomError } = require('../errors/InvokeCustomError');
const firebaseUpload = require('../../firebase');
const imageDirectoryPath = path.join(__dirname, '../../images')

exports.post_register = async (req, res, next) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send()
    } catch (err) {
        next(err)
    }
}

exports.post_login = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({ user, token })
    } catch (err) {
        next(err)
    }
}

exports.get_search_users = async (req, res, next) => {
    try {
        const keyword = req.query.keyword
        const email = req.user.email
    
        let userObj = await User.find({email: {$regex: `^${keyword}`}}).limit(10).select('email -_id')
        if (!userObj.length) {
            return res.status(204).send([])
        }

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

exports.get_user_account = async (req, res, next) => {
    try {
        const user = req.user
        res.status(200).send({ user })
    } catch (err) {
        next(err)
    }
}


exports.patch_user_account = async (req, res, next) => {
    try {

        const { firstName, lastName } = req.body
        const user = req.user
        const uploadFile = req.files
        if (firstName === user.firstName && lastName === user.lastName && uploadFile === null) {
            console.log(lastName, user.lastName)
            throw new InvokeCustomError('AccountUpdateNotValidError', 'What\'s the update? Updating with same first and last name.')
        }

        if (uploadFile !== null && uploadFile.file) {
            const avatarLocalPath = `${imageDirectoryPath}/${user._id}.png`

            fs.writeFileSync(avatarLocalPath, uploadFile.file.data)
            const avatarRemotePath = await firebaseUpload(avatarLocalPath)
            
            fs.unlink(avatarLocalPath, () => {
                console.log(`${avatarLocalPath} deleted...`)
            })

            user.avatar = avatarRemotePath
        }

        user.firstName = firstName
        user.lastName = lastName
        await user.save()
        res.status(201).send(user)
    } catch(err) {
        console.log(err)
        next(err)
    }
}



// router.patch('/users/me', auth, async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         updates.forEach((update) => req.user[update] = req.body[update])
//         await req.user.save()
//         res.send(req.user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.delete('/users/me', auth, async (req, res) => {
//     try {
//         await req.user.remove()
//         res.send(req.user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// module.exports = router