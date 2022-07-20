'use strict'

const jwt = require('jwt-simple');
const secretKey = 'llave';

exports.isLoged = (req, res, next)=>{
    if(req.headers.authorization){
        try{
            let token = req.headers.authorization.replace(/['",]+/g, '');
            let payload = jwt.decode(token, secretKey);
            req.user = payload;
            next();
        }catch(err){
            console.log(err);
            return err;
        }
    }else{
        return res.status(400).send({mesagge: 'The request does not contain the authentication header'});
    }
}

exports.isAdmin = async (req, res, next)=>{
    try{
        const user = req.user;
        if(user.role === 'ADMIN'){
            next();
        }else{
            return res.status(403).send({message: 'User unauthorized'});
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.isClient = async (req, res, next)=>{
    try{
        const user = req.user;
        if(user.role === 'CLIENT'){
            next();
        }else{
            return res.status(403).send({message: 'User unauthorized'});
        }
    }catch(err){
        console.log(err);
        return err;
    }
}
