const express = require ('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');

const Curso=require('../models/Curso');
const Pregunta=require('../models/Pregunta');
var cont=0;

router.get ('/createPregunta/*',ensureAuthenticated, (req, res)=>
Curso.findOne({_id:req.query.id}, function(err, cursos) {
 res.render('createPregunta',{
    id:cursos.id
 })
}));

router.get ('/*',ensureAuthenticated,(req, res)=>
    Curso.findOne({_id:req.query.id}, function(err, cursos) {
        res.render('curso',{
            cursos:cursos,
            preguntas:Pregunta.find()
           }); 
                    
}));


//Create Pregunta Handler
router.post('/createPregunta/*',(req,res)=>Curso.findOne({_id:req.query.id}, function(err, cursos){
    const{enunciado,opcion1,opcion2,opcion3,opcion4}=req.body;
    let errors=[];   

    if(!enunciado || !opcion1|| !opcion2|| !opcion3|| !opcion4){
        errors.push({msg: 'Rellene todos los campos'})
    }if(errors.length >0){
        res.render('createPregunta',{
            errors,
            enunciado,
            opcion1,
            opcion2,
            opcion3,
            opcion4
        });
    }else{
        const newPregunta=new Pregunta({
            enunciado,
            opcion1,
            opcion2,
            opcion3,
            opcion4
        });
        newPregunta.save();
        cursos.pregunta.push(newPregunta);
        const update= cursos.save();
        console.log(update);
        res.redirect('/dashboard');

    }

}));

 module.exports=router;