const mongoose = require('mongoose');

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
});

const Curso=mongoose.model('Curso',CursoSchema);

module.exports=Curso;