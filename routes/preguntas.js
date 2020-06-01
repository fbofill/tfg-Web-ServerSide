const express = require ('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');

const Curso=require('../models/Curso');
const Pregunta=require('../models/Pregunta');


//EDITRAR PREGUNTA
router.get ('/editPregunta/*',ensureAuthenticated, (req, res)=>
Pregunta.findOne({_id:req.query.id}, function(err, pregunta) {
 res.render('editPregunta',{
    pregunta:pregunta
 })
}));

//ELIMINAR PREGUNTA
router.get ('/deletePregunta/*',ensureAuthenticated, (req, res)=>
Pregunta.findOne({_id:req.query.id}, function(err, pregunta) {
 res.render('deletePregunta',{
    pregunta:pregunta
 })
}));
router.get ('/deleteTrue/*',ensureAuthenticated, function(req, res){
    Pregunta.findOne({_id:req.query.id},function(err,preg){
        Curso.findOne({pregunta:preg.id},function(err,cur){
            cur.pregunta.pull(preg)
            cur.save();    
        });
        preg.remove();
        res.redirect('/dashboard');
    });
   
});



router.get ('/*',ensureAuthenticated,(req, res)=>
Pregunta.findOne({_id:req.query.id}, function(err, pregunta) {
        res.render('pregunta',{
            pregunta:pregunta,
           });
           console.log
                    
}));




//Edit Pregunta Handle
router.post('/editPregunta/*',(req,res)=>Pregunta.findOne({_id:req.query.id}, function(err, pregunta){
    const{enunciado,opcion1,opcion2,opcion3,opcion4}=req.body;
    let errors=[];  

    if(enunciado){
        pregunta.enunciado=enunciado;
    }
    if(opcion1){
        pregunta.opcion1=opcion1;
    }
    if(opcion2){
        pregunta.opcion2=opcion2;
    }
    if(opcion3){
        pregunta.opcion3=opcion3;
    }
    if(opcion4){
        pregunta.opcion4=opcion4;
    }

    pregunta.save();
    res.redirect('/preguntas/?id='+pregunta.id);
        
}));





module.exports=router;