'use strict'

const mongoose = require('mongoose');

exports.init = ()=>{
    mongoose.Promise = global.Promise;
    const uriMongo = 'mongodb://127.0.0.1:27017/ProyectoFinal2018473';

    mongoose.connection.on('error', ()=>{
        console.log('MongoDB | Could not connect to MongoDB');
        mongoose.disconnect();
    });

    mongoose.connection.on('connecting', ()=>{
        console.log('MongoDB | Connecting to MongoDB');
    });

    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB | Connected to MongoDB');
    });

    mongoose.connection.once('open', ()=>{
        console.log('MongoDB | Connected to database');
    });

    mongoose.connection.on('reconnected', ()=>{{
        console.log('MongoDB | Reconnected to MongoDB');
    }});

    mongoose.connection.on('disconnected', ()=>{
        console.log('MongoDB | Error, MongoDB is desconnected');
    });

    mongoose.connect(uriMongo, {
        maxPoolSize : 5,
        connectTimeoutMS : 2500,
        useNewUrlParser : true
    }).catch(err=>console.log(err));
    
}