'use strict'

const User = require('../models/user.model');
const {dataObligatory, searchUser, encryptPassword, dencryptPassword, sameId, checkUpdate, checkUpdateForm, paramsEmptyUser, searchPhone, searchEmail} = require('../utils/validate');
const jwt = require('../services/jwt');
const CartShop = require('../models/cartShop.model');
const Bill = require('../models/bill.model');

exports.testUserController = (req, res)=>{
    return res.send({mesagge: 'The function test user controller is running'});
}

exports.register = async (req, res)=>{
    try {
        const params = req.body;
        const data = {
            name: params.name,
            lastname: params.lastname,
            username: params.username,
            password: params.password,
            role: 'CLIENT'
        }

        const msg = await dataObligatory(data);

        if(msg){
            return res.status(400).send(msg);
        }else{
            let userFound = await searchUser(params.username);
            let phoneFound = await searchPhone(params.phone);
            let emailFound = await searchEmail(params.email);
            if(userFound || phoneFound || emailFound){
                return res.send({mesagge: 'The username, phone or email already exist'});
            }else{
                data.email = params.email;
                data.phone = params.phone;
                data.password = await encryptPassword(params.password);
                let user = new User(data);
                await user.save();
                return res.send({mesagge: 'User created successfully'});
            }
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.login = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            username: params.username,
            password: params.password
        }

        const msg = await dataObligatory(data);

        if(msg){
            return res.status(400).send(msg);
        }else{
            let userFound = await searchUser(params.username);
            if(userFound && await dencryptPassword(params.password, userFound.password)){
                const token = await jwt.createToken(userFound);
                if(userFound.role === 'CLIENT'){
                    const data = {
                        user: userFound._id,
                        total: 0
                    }
                    const cartShopping = new CartShop(data);
                    const searchCartShop = await CartShop.findOne({user: userFound._id});
                    if(!searchCartShop){
                        await cartShopping.save();
                        return res.send({token, mesagge:'Entering the system... car shopping created'});
                    }else{
                        const userId = userFound._id;
                        const searchBills = await Bill.find({user: userId});
                        if(Object.entries(searchBills).length === 0){
                            return res.send({token, mesagge: 'Entering the system ... not found bills'});
                        }else{
                            return res.send({token, mesagge: 'Entering the system... ', searchBills});
                        } 
                    }
                }else{
                    return res.send({token, mesagge: 'Entering the system... admin cant have car shopping'});
                }
            }else{
                return res.status(400).send({mesagge: 'Incorrect username or password'});
            }
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateUser = async (req, res)=>{
    try{
        const userId = req.params.id;
        const idLoged = req.user.sub;
        const params = req.body;
        const coincidence = await sameId(userId, idLoged);
        if(coincidence === true){
            const notUpdate = await checkUpdate(params);
            const formEmpty = await paramsEmptyUser(params);
            if(notUpdate === true || formEmpty === true){
                return res.status(400).send({mesagge: 'The form contain a param empty or role is coming'});
            }else{
                const userFound = await searchUser(params.username);
                if(userFound){
                    return res.send({mesagge: 'The username already exist'});
                }else{
                    params.password = await encryptPassword(params.password);
                    const userUpdated = await User.findOneAndUpdate({_id: userId}, params, {new : true}).lean();
                    return res.send({userUpdated, message: 'User updated'});
                }
            }
        }else{
            return res.status(403).send({message:'Unauthorized to update this user'});
        }
    }catch (err){
        console.log(err);
        return err;
    }
}

exports.updateByAdmin = async (req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;
        const notUpdate = await checkUpdateForm(params);
        const formEmpty = await paramsEmptyUser(params);
        if(notUpdate === true || formEmpty === true){
            return res.status(400).send({mesagge: 'The form contain a param empty'});
        }else{
            const user = await User.findOne({_id: userId});
            if(user){
                if(user.role === 'CLIENT'){
                    params.password = await encryptPassword(params.password);
                    const userUpdated = await User.findOneAndUpdate({_id : userId}, params, {new : true}).lean();
                    return res.send({userUpdated, message: 'User updated'});
                }else{
                    return res.send({mesagge: 'Cant update admin'});
                }
            }else{
                return res.status(404).send({mesagge: 'User not found'});
            }
        }
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.deleteUser = async (req, res)=>{
    try{
        const userId = req.params.id;
        const idLoged = req.user.sub;
        const coincidence = await sameId(userId, idLoged);
        if(coincidence === true){
            const userDelete = await User.findOneAndDelete({_id: userId});
            if(userDelete){
                return res.send({userDelete, mesagge: 'User deleted'});
            }else{
                return res.status(400).send({message:'This user does not exist'});
            }
        }else{
            return res.status(403).send({message:'Unauthorized to delete this user'});
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteUserByAdmin = async(req, res)=>{
    try{
        const userId = req.params.id;
        const user = await User.findOne({_id: userId});
        if(user){
            if(user.role === 'CLIENT'){
                const userDelete = await User.findOneAndDelete({_id: userId});
                return res.send({userDelete, mesagge: 'User deletd'});
            }else{
                return res.send({mesagge: 'Cant delete admin'});
            }
        }else{
            return res.status(400).send({mesagge: 'This user does not exist'});
        }
    }catch(err){
        console.log(err);
        return err;
    }
}
