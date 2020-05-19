const express = require ('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');
const Curso=require('../models/Curso');



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
 res.render('dashboard',{
     name: req.user.name,
     cursos:cursos  
    });  
 }));


module.exports=router;
