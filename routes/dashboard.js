const express = require ('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');

const Curso=require('../models/Curso');

router.get ('/createCurso',ensureAuthenticated, (req, res)=>
 res.render('createCurso',{
 
 }));

 //Create Curso Handler
 router.post('/createCurso',(req,res)=>{
    const{name,description,level}=req.body;
    console.log(req.body);
    let errors=[];

       //comprobacion requeridos
    if(!name || !description){
    errors.push({msg: 'Rellene todos los campos'})
    }
    if(errors.length >0){
        res.render('createCurso',{
            errors,
            name,
            description,
            level
        });
    }else{

    Curso.findOne({name:name})
    .then(curso=>{
        if(curso){
            errors.push({msg: 'El curso ya está registrado'})
            res.render('createCurso',{
                errors,
                name,
                description,
                level
            });
        }else{
            const newCurso=new Curso({
                name,
                description,
                level
            });
            newCurso.save();
            res.redirect('/dashboard');
        }
    });
    }

 });








module.exports=router;