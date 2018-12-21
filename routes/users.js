const errors = require('restify-errors')
const User  = require('../models/User')
const auth = require('../auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require("../config")


module.exports = server => {
    // Register User
    server.post('/register', (req, res, next) => {
        const {email, password}  = req.body

        const user = new User({email, password})
        //generate the salt with 10 rounds
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, async(err, hash) => {
                user.password = hash
                //save the user
                try {
                    const newUser = user.save()
                    res.send(201)
                    next()
                 }
                 catch(e) {
                    return next(new errors.InternalError(e.message))   
                }

            })


        })
    })



    //Auth user 
    server.post('/auth', async (req, res, next) => {
        const {email, password}  = req.body
      
        
        try {
            //Authentiate User
            const user = await auth.authenticate(email,password)

              //Create token
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {expiresIn: '15m'})
            const { iat, exp} = jwt.decode(token)

             //rersppond with token
            res.send({iat, exp, token})
            

        }
        catch(e) {
            // user unauthorized
            return next(new errors.UnauthorizedError(e))

        }

    } )
}