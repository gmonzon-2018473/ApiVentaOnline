'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'llave';

exports.createToken = async (user)=>{
    try{
        const payload = {
            sub: user._id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            username: user.username,
            password: user.password,
            role: user.role,
            iat: moment().unix(),
            exp: moment().add(1, 'hour').unix()
        }
        return jwt.encode(payload, secretKey);
    }catch(err){
        console.log(err);
        return err;
    }
}
