const express = require ('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');
const Curso=require('../models/Curso');

var name ="TEST";


router.get ('/curso/*',ensureAuthenticated, (req, res)=>
 res.render('curso',{
     name:name
 
 }));


















module.exports=router;