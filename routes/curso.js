const express = require ('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');

const Curso=require('../models/Curso');
const Pregunta=require('../models/Pregunta');
const User=require('../models/User');




router.get ('/createPregunta/*',ensureAuthenticated, (req, res)=>
Curso.findOne({_id:req.query.id}, function(err, cursos) {
 res.render('createPregunta',{
    id:cursos.id
 })
}));

//EDITRAR CURSO
router.get ('/editCurso/*',ensureAuthenticated, (req, res)=>
Curso.findOne({_id:req.query.id}, function(err, curso) {
    Curso.find({},function(err,cursos){
        res.render('editCurso',{
            curso:curso,
            cursos:cursos
    })
 })
}));


//ELIMINAR CURSO
router.get ('/deleteCurso/*',ensureAuthenticated, (req, res)=>
Curso.findOne({_id:req.query.id}, function(err, cursos) {
 res.render('deleteCurso',{
    id:cursos.id
 })
}));
router.get ('/deleteTrue/*',ensureAuthenticated, function(req, res){
    Curso.findById(req.query.id,function(err,cur){
        if(err){
            console.log(err)
        }else{
            if(cur){
                User.find({desbloqueados:cur})
                .then(us=>{
                    us.forEach(usr=>{
                        if(usr){
                            usr.desbloqueados.pull(cur);
                            usr.save();
                        }
                    })
                })
            }
        }
        
    });

    Curso.findByIdAndDelete(req.query.id,function(err){
        if(err) res.render('delete',{
            errors
        })
        res.redirect('/dashboard');
    })
});

router.get ('/*',ensureAuthenticated,(req, res)=>
    Curso.findOne({_id:req.query.id}, function(err, cursos) {
        res.render('curso',{
            cursos:cursos,
           }); 
                    
}));


//Create Pregunta Handler
router.post('/createPregunta/*',(req,res)=>Curso.findOne({_id:req.query.id}, function(err, cursos){
    const{enunciado,opcion1,opcion2,opcion3,opcion4}=req.body;
    let errors=[];   

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
        cursos.pregunta.push(newPregunta);
        const update=cursos.save();
        console.log(update);
        res.redirect('/curso/?id='+cursos._id);

    }
}));

//Edit Curso Handle
router.post('/editCurso/*',(req,res)=>Curso.findOne({_id:req.query.id}, function(err, cursos){
    const{name,description,level,aUnlock,bUnlock,unlocked}=req.body;
    let errors=[];

    if(!name || !description){
        errors.push({msg: 'Rellene todos los campos'})
        }
        if(errors.length >0){
            res.render('editCurso',{
                errors,
                cursos:cursos
            });
        }else{
            cursos.name=name;
            cursos.description=description;
            cursos.level=level;

            a1=Curso.findOne({_id:aUnlock})
            .then(aunl=>{
                if(aunl){
                    cursos.aUnlock=aunl;
                }else{
                    cursos.aUnlock=null;
                }

            })
            .catch(err=> cursos.aUnlock=null);

            a2=Curso.findOne({_id:aUnlock})
            .then(bunl=>{
                if(bunl){
                    cursos.bUnlock=bunl;
                }else{
                    cursos.aUnlock=null;
                }
            
         }).catch(err=>err=> cursos.aUnlock=null);

         if(unlocked==="true"){
            cursos.unlocked=true;
        }else{
            cursos.unlocked=false;
        }

         Promise.all([a1,a2]).then(correcto=>{
            cursos.save();
        });
            res.redirect('/dashboard');
        }

}));


 module.exports=router;