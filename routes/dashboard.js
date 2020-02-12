const express = require ('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');

router.get ('/createCurso',ensureAuthenticated, (req, res)=>
 res.render('createCurso',{
 
 }));


module.exports=router;