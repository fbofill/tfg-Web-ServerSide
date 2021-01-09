const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated}= require('../config/auth');


//User model
const User = require ('../models/User');
const Curso=require('../models/Curso');


router.get ('/*',ensureAuthenticated,(req, res)=>
    User.findOne({_id:req.query.id}, function(err, user) {
        Curso.find({_id:user.completados},function(err, cursos){
            console.log(user);
            res.render('userProfile',{
            user:user,
            cursos:cursos
           }); 
        })                 
}));







module.exports=router;