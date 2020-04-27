const mongoose = require('mongoose');

const PreguntaSchema=new mongoose.Schema({
    enunciado:{
        type:String,
        required:true
    },
    opcion1:{           //En el modo lazy la opcion 1 será la correcta y al mostrar se mostraran en orden aleatorio.
        type:String,
        required:true/*,
        rw:Boolean*/
    },
    opcion2:{
        type:String,
        required:true/*,
        rw:Boolean*/
    },
    opcion3:{
        type:String,
        required:true/*,
        rw:Boolean*/
    },
    opcion4:{
        type:String,
        required:true/*,
        rw:Boolean*/
    }
});

const Pregunta=mongoose.model('Pregunta',PreguntaSchema);

module.exports=Pregunta;