const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated}= require('../config/auth');


//User model
const User = require ('../models/User');


router.get ('/*',ensureAuthenticated,(req, res)=>
    User.findOne({_id:req.query.id}, function(err, user) {
        res.render('userProfile',{
            user:user,
           }); 
                    
}));







module.exports=router;