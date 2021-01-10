const Curso=require('../models/Curso');
const User=require('../models/User');

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const CompletadosSchema=new mongoose.Schema({
    usuario:  
        {type:Schema.Types.ObjectId, 
            ref: 'User',
            required:true
        },
    curso:{
        type:String, 
        required:true
        },
    score:{
        type:Number,
        required:true
    }
});





const Completados=mongoose.model('Completados',CompletadosSchema);

module.exports=Completados;