const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');



//User model
const User = require ('../models/User');
const Curso = require ('../models/Curso');
const Pregunta = require ('../models/Pregunta');
const Completados = require ('../models/Completados');


//GET CURSOS
router.post ('/getCursos/', (req, res)=>{
    var post_data = req.body;
    var id=post_data.id;
    User.findById(id).then(usr=>{
         if(usr){
            Curso.find({_id:usr.desbloqueados}).then(cur=>{
                if(cur){
                    res.json(cur);
                } 
            })
        }
    })      
}
);

//DELETE USER
router.post ('/deleteUser/', (req, res)=>{
    var post_data = req.body;
    var id=post_data.id;
    console.log("ID"+ id);
    User.findByIdAndDelete(id,function(err){
        if(err) {
            console.log("ERROR"+ err);
        }else{
            res.json(1);
        }
        
    })   
});

//EDIT USER
router.post ('/editUser/', (req, res)=>{
    var post_data = req.body;
    const {id,name,email,password,password2}=req.body;
    User.findById(id).then(usr=>{
        if(usr){
          if(name){
              usr.name=name;
          }
          if(email){
            usr.email=email;
          }if(password){
            bcrypt.genSalt(10,(error, salt)=>
            bcrypt.hash(req.body.password,salt, (error, hash)=>{
            if(error) throw err;
            usr.password=hash;
            }));
            }
            usr.save();
            res.json(usr);
          }
        })
    });


//GET CURSOS COMPLETADO
router.post ('/getCursosCompletado/', (req, res)=>{
    var post_data = req.body;
    var nombre=post_data.name;
    User.findOne({name:nombre}).then(usr=>{
         if(usr){
            Completados.find({usuario:usr.name}).then(cur=>{
                console.log(cur);
                if(cur){
                    res.json(cur);
                } 
            })
        }
    })      
}
);

//END QUIZ
router.post('/endQuiz',(req,res)=>{
    var post_data = req.body;

    var userid=post_data.userid;
    var points=post_data.points;
    var cursoname=post_data.cursoname;

    points=parseInt(points,10);
    

    User.findById(userid).then(usr=>{
        if(usr){
           Curso.findOne({name:cursoname}).then(cur=>{
               if(cur){
                  var yaCompletado=usr.completados.some(function(ya){
                    return ya.equals(cur._id);
                  });
                  if(!yaCompletado){
                      if(usr.points>=0){
                        usr.points+=points;
                    }
                    usr.completados.push(cur);
                    if(points<5){
                        Curso.findById(cur.bUnlock).then(add=>{
                            if(add){
                                usr.desbloqueados.push(add);
                                usr.save();

                            }  
                        });
                    }else{
                     Curso.findById(cur.aUnlock).then(add=>{
                         if(add){
                            usr.desbloqueados.push(add); 
                            usr.save();
                         }
                        });
                    }
                    const comp = new Completados();
                    comp.usuario=usr.name;
                    comp.curso=cur.name;
                    comp.score=points;
                    comp.save().then(function(){
                    }).catch(function(err){
                        console.log(err);
                    });
                  }
                   res.json(usr);
               } 
           })
       }
   })
});


//API REGISTER HANDLE
router.post('/register',(req, res)=>{

const {name,email,password,password2,points}=req.body;
     //Validacion en cliente
     User.findOne({email:email})
     .then(user => {
         if(user){
             //Existe el usuario
             res.json('El email ya está registrado');
         }else{
             const newUser= new User({
                 name,
                 email,
                 password,
                 points
             });
            
             //Hash Password
             bcrypt.genSalt(10,(error, salt)=>
             bcrypt.hash(newUser.password,salt, (error, hash)=>{
                 if(error) throw err;
                 //Convertir contraseña en hash
                 newUser.password=hash;
                 //Guardar usuario
                 Curso.find({unlocked:"true", publicado:"true"}).then(cur=>{
                    if(cur){
                        cur.forEach(curso=>{
                            if(curso){
                                newUser.desbloqueados.push(curso);
                            } 
                        })
                        newUser.save()
                        .then(user=>{
                           res.json('Ya te has registrado y puedes iniciar session');
                        })
                        .catch(err =>console.log(err));
                    }
                 }).catch(err=>console.log(err));
                
             }))
         }
     });
 
});

//API LOGIN HANDLE
//LOGIN
router.post('/login',(req,res,next)=>{
    var post_data =req.body;

    var email = post_data.email;
    var password = post_data.password;

    User.findOne({email:email})
    .then(user => {
        if(!user){
            //No existe el usuario
            res.status(400).send('Email no existe');
        }else{
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    res.json(user);
                } else {
                    res.status(400).send('Contraseña Incorrecta');
                }
              });
        }
        });
});
//Get Preguntas

router.post('/getPreguntas',(req,res,next)=>{
    var post_data =req.body;

    var name = post_data.name;

    Curso.findOne({name:name})
    .then(curso => {
        if(!curso){
            //No existe el usuario
            res.status(400);
        }else{
            Pregunta.find({_id:curso.pregunta})
            .then(pregunta=>{
                if(!pregunta){
                    res.status(400);
                }else{
                    res.json(pregunta);
                }
            })
        }
        });
});

exports.getProfile = email => 
	
	new Promise((resolve,reject) => {

		user.find({ email: email }, { name: 1, email: 1})

		.then(users => resolve(users[0]))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

module.exports=router;