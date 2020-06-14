const mongoose = require('mongoose');
const Pregunta=require('../models/Curso');
Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    date:{
        type: Date,
        default:Date.now
    },
    points:{
        type: Number
    },
    desbloqueados:[
        {type:Schema.Types.ObjectId, 
        ref: 'Curso'
    }]
});

const User=mongoose.model('User', UserSchema);

module.exports =User;

