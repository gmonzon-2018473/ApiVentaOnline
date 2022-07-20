'use strict'

const CartShop = require('../models/cartShop.model');
const Product = require('../models/product.model');
const {dataObligatory,  sameId} = require('../utils/validate');

exports.testCartShopController = (req, res)=>{
    return res.send({mesagge: 'The function test cart shop controller is running'});
}

exports.addProduct = async (req, res)=>{
    try{
        const params = req.body;
        const idLoged = req.user.sub;
        const data = {
            name: params.name,
            amount: params.amount
        }
        const msg = dataObligatory(data);
        if(msg){
            return res.status(400).send(msg);
        }else{
            const searchProduct = await Product.findOne({name: params.name});
            if(searchProduct){
                if(params.amount > searchProduct.stock){
                    return res.send({mesagge: `You cannot make the purchase because the stock is ${searchProduct.stock}`});
                }else{
                    const cartShopUpdated = await CartShop.findOneAndUpdate({user: idLoged}, {$push: {products: [{product: {productId: searchProduct._id, name: params.name, price: searchProduct.price, amount: params.amount, subTotal: (searchProduct.price * params.amount)}}]}}, {new: true});
                    const searchCartShop = await CartShop.findOne({user: idLoged}).lean();
                    const arrayCartShop = Object.entries(searchCartShop.products);
                    let total = 0;
                    for(let i = 0; i < arrayCartShop.length; i++){
                        total = total + searchCartShop.products[i].product.subTotal;
                    }
                    const cartShopUpdatedTotal = await CartShop.findOneAndUpdate({user: idLoged}, {total: total}, {new: true});
                    return res.send({cartShopUpdatedTotal, mesagge: 'Car shopping updated'});
                }
            }else{
                return res.send({mesagge: 'This product dont exist'});
            }
        }

    }catch(err){
        console.log(err);
        return err;
    }
}
