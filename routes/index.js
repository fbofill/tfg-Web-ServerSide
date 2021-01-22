const express = require ('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');
const Curso=require('../models/Curso');
const User=require('../models/User');



//WELCOME
router.get ('/welcome', (req, res)=> res.render('welcome'));

router.get ('/',ensureAuthenticated, (req, res)=>
Curso.find({}, function(err, cursos) {
    res.render('dashboard',{
        name: req.user.name,
        cursos:cursos  
       });  
 }));

//DASHBOARD
router.get ('/dashboard',ensureAuthenticated, (req, res)=>
Curso.find({}, function(err, cursos) {
    if(req.user.points){
        res.render('disclaimer');
    }else{
        res.render('dashboard',{
            name: req.user.name,
            cursos:cursos  
           }); 
    }  
 }));

 //RANKING
 router.get ('/ranking',ensureAuthenticated, (req, res)=>
User.find({points:{ $gte: 0 }},null,{sort:{points:'descending'}} , function(err, user) {
 res.render('ranking',{
    user:user
 });  
 }));

  //OPCIONES
  router.get ('/options', (req, res)=> res.render('options'));


module.exports=router;
