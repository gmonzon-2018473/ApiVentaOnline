'use strict'

const Product = require('../models/product.model');
const {dataObligatory, searchProduct, paramsEmptyProduct, checkUpdateForm} = require('../utils/validate');

exports.testProductController = (req, res)=>{
    return res.send({mesagge: 'The function test product controller is running'});
}

exports.saveProduct = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            price: params.price,
            stock: params.stock,
            totalSales: 0,
            category: params.category
        }

        const msg = await dataObligatory(data);

        if(msg){
            return res.status(400).send(msg);
        }else{
            let productFound = await searchProduct(params.name);
            if(productFound){
                return res.send({mesagge: 'The product already exist'});
            }else{
                if(params.stock < 0){
                    return res.send({mesagge: 'The stock cant be negative'})
                }else{
                    let product = new Product(data);
                    await product.save();
                    return res.send({mesagge: 'Product saved successfully'});
                }
                
            }

        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateProduct = async (req, res)=>{
    try{
        const productId = req.params.id;
        const params = req.body;
        const notUpdate = await checkUpdateForm(params); 
        const formEmpty = await paramsEmptyProduct(params);
        if(notUpdate === true || formEmpty === true){
            return res.status(400).send({mesagge: 'The form contain a param empty'});
        }else{
            if(!params.name){
                const updateProduct = await Product.findOneAndUpdate({_id: productId}, params, {new : true}).lean();
                return res.send({updateProduct, message: 'Product updated'});
            }else{
                const productFound = await searchProduct(params.name);
                if(productFound){
                    return res.send({mesagge: 'The product already exist'});
                }else{
                    const updateProduct = await Product.findOneAndUpdate({_id: productId}, params, {new : true}).lean();
                    return res.send({updateProduct, message: 'Product updated'});
                }
            }
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteProduct = async (req, res)=>{
    try{
        const productId = req.params.id;
        const productDelete = await Product.findOneAndDelete({_id: productId});
            if(productDelete){
                return res.send({productDelete, mesagge: 'Product deleted'});
            }else{
                return res.send({message:'This product not exist'});
            }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getProducts = async (req, res)=>{
    try{
        const products = await Product.find().populate('category').lean();
        return res.send({products});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getProduct = async (req, res)=>{
    try{
        const   productId = req.params.id;
        const product = await Product.findOne({_id: productId});
        if(product){
            return res.send({product});
        }else{
            return res.send({mesagge: 'Product not found'});
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.soldOutProducts = async (req, res)=>{
    try{
        const soldOut = await Product.find({stock: 0});
        if(soldOut == 0){
            return res.send({mesagge: 'There are no out of stock products'});
        }else{
            return res.send(soldOut);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.productsMostSale = async (req, res)=>{
    try{
        const mostSale = await Product.find().sort({totalSales: -1});
        return res.send({mostSale});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchProducts = async (req, res)=>{
    try{
        const params = req.body;
        if(Object.entries(params).length === 0 || params.name === ''){
            return res.status(400).send({mesagge: 'The form contain a param empty'});
        }else{
            let productFounds = await Product.find({name: {$regex: params.name, $options: 'i'}}).lean();
            if(productFounds){
                return res.send({productFounds});
            }else{
                return res.send({mesagge: 'Product not found'});
            }    
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchProductsByCategory = async (req, res)=>{
    try{
        const params = req.body;
        if(Object.entries(params).length === 0 || params.category === ''){
            return res.status(400).send({mesagge: 'The form contain a param empty'});
        }else{
            let productFounds = await Product.find({category: params.category}).populate('category').lean();
            if(productFounds){
                if(Object.entries(productFounds).length === 0){
                    return res.send({mesagge: 'Product not found in this category'});
                }else{
                    return res.send({productFounds});
                }
            }else{
                return res.send({mesagge: 'Product not found'});
            }    
        }
    }catch(err){
        console.log(err);
        return err;
    }
}




