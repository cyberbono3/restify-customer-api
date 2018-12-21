const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.authenticate = (email, password) => {
    return new Promise(async (resolve,reject) => {
        try {
            //get user by email
            const user = await User.findOne({email})

            //compare password entered by user with password stored in DB
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err
                if(isMatch)  {
                    resolve(user)
                 }else {
                    // pass did not maztch
                    reject("Autrhentication failed")
                }

            })

        }
        
        catch(e){
            //Email not found
            reject('Authentication failed')


        }
    })
}