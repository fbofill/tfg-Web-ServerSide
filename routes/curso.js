const express = require ('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');

const Curso=require('../models/Curso');
const Pregunta=require('../models/Pregunta');
var cont=0;

router.get ('/createPregunta',ensureAuthenticated, (req, res)=>
 res.render('createPregunta',{
 
 }));

router.get ('/*',ensureAuthenticated,(req, res)=>
    Curso.findOne({_id:req.query.id}, function(err, cursos) {
        res.render('curso',{
            name: cursos.name,
           }); 
           
}));



//Create Pregunta Handler
router.post('/createPregunta',(req,res)=>{
    const{enunciado,opcion1,opcion2,opcion3,opcion4}=req.body;
    let errors=[];

    console.log(enunciado,opcion1,opcion2,opcion3,opcion4);

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
        res.redirect('/dashboard');

    }

});




 module.exports=router;