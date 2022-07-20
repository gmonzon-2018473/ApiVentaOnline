'use strict'

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

exports.dataObligatory = (data)=>{
    let keys = Object.keys(data);
    let msg = '';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
            msg += `The param ${key} is required\n`;
    }
    return msg.trim();
}

exports.searchUser = async (username)=>{
    try{
        let userFound = User.findOne({username: username}).lean();
        return userFound;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchPhone = async (phone)=>{
    try{
        let phoneFound = User.findOne({phone: phone}).lean();
        return phoneFound;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchEmail = async (email)=>{
    try{
        let emailFound = User.findOne({email: email}).lean();
        return emailFound;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.encryptPassword = async (password)=>{
    try {
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.dencryptPassword = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.sameId = async (userId, sub)=>{
    try{
        if(userId == sub){
            return true;
        }else{
            return false;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (user)=>{
    try{
        if(Object.entries(user).length === 0 || user.role){
            return true;
        }else{
            return false;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdateForm = async (user)=>{
    try{
        if(Object.entries(user).length === 0){
            return true;
        }else{
            return false;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.paramsEmptyUser = async (params)=>{
    try{
        if(params.name === '' || params.lastname === ''|| params.email === '' || params.phone === '' || params.username === '' || params.password === '' || params.role === ''){
            return true;
        }else{
            return false
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.paramsEmptyProduct = async (params)=>{
    try{
        if(params.name === '' || params.price === ''|| params.stock === '' || params.totalSales === '' || params.category === ''){
            return true;
        }else{
            return false
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchCategory = async (name)=>{
    try{
        let categoryFound = Category.findOne({name: {$regex: name, $options: 'i'}}).lean();
        return categoryFound;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchProduct = async (name)=>{
    try{
        let productFound = Product.findOne({name: {$regex: name, $options: 'i'}}).lean();
        return productFound;
    }catch(err){
        console.log(err);
        return err;
    }
}



