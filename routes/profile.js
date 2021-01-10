const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated}= require('../config/auth');


//User model
const User = require ('../models/User');
const Curso=require('../models/Curso');
const Completados = require('../models/Completados');


router.get ('/*',ensureAuthenticated,(req, res)=>
    User.findOne({_id:req.query.id}, function(err, user) {
        Completados.find({usuario:user.name},function(err, completados){
            res.render('userProfile',{
            user:user,
            completados:completados
           }); 
        })                 
}));







module.exports=router;