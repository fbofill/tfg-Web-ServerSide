const express = require ('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');


const Curso=require('../models/Curso');
const User=require('../models/User');

router.get ('/createCurso',ensureAuthenticated, (req, res)=>
Curso.find({}, function(err, cursos) {
    res.render('createCurso',{
        cursos:cursos  
       });  
 }));

 //Create Curso Handler
 router.post('/createCurso',(req,res)=>{
    const{name,description,level,aUnlock,bUnlock,unlocked}=req.body;
    let errors=[];

       //comprobacion requeridos
    if(!name || !description){
    errors.push({msg: 'Rellene todos los campos'})
    }
    if(errors.length >0){
        res.render('/dashboard',{
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
                level,   
            });
            a1=Curso.findOne({_id:aUnlock})
                .then(aunl=>{
                    if(aunl){
                        newCurso.aUnlock=aunl;
                    }else{
                        newCurso.aUnlock=null;
                    }

                })
                .catch(err=> newCurso.aUnlock=null);

                a2=Curso.findOne({_id:aUnlock})
                .then(bunl=>{
                    if(bunl){
                        newCurso.bUnlock=bunl;
                    }else{
                        newCurso.aUnlock=null;
                    }

             }).catch(err=>err=> newCurso.aUnlock=null);
            
            if(unlocked==="true"){
                newCurso.unlocked=true;
            }
            
            Promise.all([a1,a2]).then(correcto=>{
                newCurso.save();
            });
  
            /*if(unlocked==="true"){
                User.find({})
                .then(us=>{
                    us.forEach(usr => {
                        if(usr){
                            usr.desbloqueados.push(newCurso);
                            usr.save();
                        }
                    });
                });
            }*/ 
             
        }
    });
    }
    res.redirect('/dashboard');
 });


module.exports=router;