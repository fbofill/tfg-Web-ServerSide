const Pregunta=require('../models/Pregunta');
const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const CursoSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    level:{
        type:String,
        required:true
    },
    pregunta:[{
        type:Schema.Types.ObjectId, 
        ref: 'Pregunta',
        required:true
    }],
    aUnlock:{
        type:Schema.Types.ObjectId, 
        ref: 'Curso',
        default:null

    },
    bUnlock:{
        type:Schema.Types.ObjectId, 
        ref: 'CursoSchema',
        default:null
    },
    unlocked:{
        type:Boolean,
        default:false
    },
    publicado:{
        type:Boolean,
        default:false
    }
});

const Curso=mongoose.model('Curso',CursoSchema);

module.exports=Curso;