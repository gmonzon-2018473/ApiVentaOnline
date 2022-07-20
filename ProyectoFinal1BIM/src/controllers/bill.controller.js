'use strict'

const Bill = require('../models/bill.model');
const CartShop = require('../models/cartShop.model');
const Product = require('../models/product.model');
const {dataObligatory} = require('../utils/validate');

exports.testBillController = (req, res)=>{
    return res.send({mesagge: 'The function test bill controller is running'});
}

exports.createBill = async (req, res)=>{
    try{
        const params = req.body;
        const cartShop = await CartShop.findOne({user: req.user.sub});
        const data = {
            cartShop: cartShop._id,
            date: new Date,
            user: cartShop.user,
            products: cartShop.products,
            total: cartShop.total
        }

        const msg = await dataObligatory(data);

        if(msg){
            return res.status(400).send(msg);
        }else{
            if(Object.entries(cartShop.products).length === 0){
                return res.send({mesagge: 'There are not products in the car shopping'})
            }else{
                let bill = new Bill(data);
                await bill.save();
                const dataClear = []
                const cartShopClear = await CartShop.findOneAndUpdate({user: req.user.sub}, {products: dataClear, total: 0}, {new: true});
                const searchBill = await Bill.findOne({_id: bill._id});
                const arrayProducts = Object.entries(searchBill.products);
                for(let i = 0; i < arrayProducts.length; i++){
                    let idProduct = searchBill.products[i].product.productId;
                    let amount = searchBill.products[i].product.amount;
                    let searchProduct = await Product.findOne({_id: idProduct}).lean();
                    let stock = searchProduct.stock;
                    let totalSales = searchProduct.totalSales;
                    let productUpdated = await Product.findOneAndUpdate({_id: idProduct}, {stock: (stock-amount), totalSales: (totalSales+amount)}, {new: true});
                }
                return res.send({bill, mesagge: 'Bill created successfully'}); 
            }
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getBills = async (req, res)=>{
    try{
        const userId = req.params.id;
        const searchBills = await Bill.find({user: userId});
        if(Object.entries(searchBills).length === 0){
            return res.send({mesagge: 'Not found bills'});
        }else{
            return res.send(searchBills);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getBill = async (req, res)=>{
    try{
        const billId = req.params.id;
        const searchBill = await Bill.findOne({_id: billId});
        if(!searchBill){
            return res.send({mesagge: 'Not found bill'});
        }else{
            return res.send(searchBill);
        }
    }catch(err){
        console.log(err);
        return err;
    }

}