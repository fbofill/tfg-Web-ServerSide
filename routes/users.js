const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated}= require('../config/auth');


//User model
const User = require ('../models/User');

//login
router.get ('/login', (req, res)=> res.render('login'));

//REGISTER
router.get ('/register', (req, res)=> res.render('register'));

 //EDIT USER
router.get ('/editUser',ensureAuthenticated, (req, res)=>
User.findOne({_id:req.user.id}, function(err, user) {
    res.render('edit',{
        user:user
       });
 }));

  //DELETE USER
  router.get ('/deleteUser',ensureAuthenticated, (req, res)=> res.render('delete'));
  router.get ('/deleteTrue',ensureAuthenticated, function(req, res){
      User.findByIdAndDelete(req.user._id,function(err){
          if(err) res.render('delete',{
              errors
          })
          res.redirect('/users/logout');
      })
  });
 

//Register Handle
router.post('/register',(req, res)=>{
   const {name,email,password,password2}=req.body;
   let errors=[];

   //comprobacion requeridos
   if(!name || !email || !password || !password2){
       errors.push({msg: 'Rellene todos los campos'})
   }
     //comprobacion contraseñas
     if(password !== password2){
        errors.push({msg: 'Las contraseñas no coinciden'})
    }
      //tamaño contraseña
      if(password.length < 6){
        errors.push({msg: 'Las contraseñas debe tener al menos 6 caracteres'})
    }
      //ERROR
      if(errors.length >0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2

        });
    }else{
        //Validacion completada
        User.findOne({email:email})
        .then(user => {
            if(user){
                //Existe el usuario
                errors.push({msg: 'El email ya está registrado'})
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                //let points=0;
                const newUser= new User({
                    name,
                    email,
                    password
                    /*points,*/
                });
                //Hash Password
                bcrypt.genSalt(10,(error, salt)=>
                bcrypt.hash(newUser.password,salt, (error, hash)=>{
                    if(error) throw err;
                    //Convertir contraseña en hash
                    newUser.password=hash;
                    //Guardar usuario
                    newUser.desbloqueados=[];
                    newUser.save()
                    .then(user=>{
                        req.flash('success_msg', 'Ya te has registrado y puedes iniciar session');
                        res.redirect('/users/login');
                    })
                    .catch(err =>console.log(err));

                }))

            }
        });

    }

});



//Edit Handle
router.post('/editUser',(req, res)=>User.findOne({_id:req.user.id},function(err,newUser){
    const {name,email,password,password2}=req.body;
    let errors=[];
    let chagePass;
 
    if(password && password2){ //Se ha modificado la contraseña
        if(password !== password2){
            errors.push({msg: 'Las contraseñas no coinciden'})
        }
        //tamaño contraseña
        if(password.length < 6){
        errors.push({msg: 'Las contraseñas debe tener al menos 6 caracteres'})
        }
        chagePass=true;
    }
    
    if(name){//se ha actualizado el nombre
        newUser.name=name;
    }

    if(email){//se ha modificado el mail
        const userExist = User.findOne({email:email});
        if(userExist.email){
            //Existe el usuario
            errors.push({msg: 'El email ya está registrado'})
        }else{
            newUser.email=email;   
        }
    }

    if(errors.length >0){
        res.render('edit',{
            errors,
            user:newUser
        });
    }else{
        if(chagePass){
            bcrypt.genSalt(10,(error, salt)=>
            bcrypt.hash(req.body.password,salt, (error, hash)=>{
                console.log("HASH: " + hash);
                if(error) throw err;
                //Convertir contraseña en hash
                newUser.password=hash;
                newUser.save();
            }));
        }else{
        newUser.save();
        res.redirect('/options');
    }
    } 
}));



//LOGIN
router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//LOGOUT
router.get('/logout', (req,res)=>{
    req.logOut();
    req.flash('success_msg','Sesion cerrada con exito');
    res.redirect('/users/login');
});



module.exports=router;
