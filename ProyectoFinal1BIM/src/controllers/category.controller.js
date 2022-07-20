'use strict'

const Category = require('../models/category.model');
const Product = require('../models/product.model');
const {dataObligatory, searchCategory} = require('../utils/validate');

exports.testCategoryController = (req, res)=>{
    return res.send({mesagge: 'The function test category controller is running'});
}

exports.saveCategory = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name
        }

        const msg = await dataObligatory(data);

        if(msg){
            return res.status(400).send(msg);
        }else{
            let categoryFound = await searchCategory(params.name);
            if(categoryFound){
                return res.send({mesagge: 'The category already exist'});
            }else{
                let category = new Category(data);
                await category.save();
                return res.send({category, mesagge: 'Category created successfully'}); 
            }
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateCategory = async (req, res)=>{
    try{
        const categoryId = req.params.id;
        const params = req.body;
        const data = {
            name: params.name
        }

        const msg = await dataObligatory(data);

        if(msg){
            return res.status(400).send(msg);
        }else{
            const categoryFound = await searchCategory(params.name);
            if(categoryFound){
                return res.send({mesagge: 'The category already exist'});
            }else{
                const categoryUpdated = await Category.findOneAndUpdate({_id: categoryId}, params, {new: true}).lean();
                return res.send({categoryUpdated, message: 'Category updated'});
            }
        }        
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteCategory = async (req, res)=>{
    try{
        const categoryId = req.params.id;
        const searchCategory = await Category.findOne({_id: categoryId});
        if(searchCategory && searchCategory.name !== 'Default'){
            const productsFound = await Product.find({category: categoryId}).lean();
            if(Object.entries(productsFound).length === 0){
                const categoryDelete = await Category.findOneAndDelete({_id: categoryId});
                return res.send({mesagge: 'Category deleted'});
            }else{
                const searchDefault = await Category.findOne({name: {$regex: 'Default', $options: 'i'}});
                const productsUpdated = await Product.updateMany({category: categoryId}, {$set: {category: searchDefault}});          
                const categoryDeleted = await Category.findOneAndDelete({_id: categoryId});
                return res.send({mesagge: 'Category deleted'});
            }
        }else{
            return res.send({mesagge: 'Category not found or category Default is coming'});
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getCategories = async (req, res)=>{
    try{
        const categories = await Category.find();
        return res.send({categories});
    }catch(err){
        console.log(err);
        return err;
    }
}