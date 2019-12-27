const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require ('../models/User');

//login
router.get ('/login', (requ, res)=> res.render('login'));

//REGISTER
router.get ('/register', (requ, res)=> res.render('register'));

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
                const newUser= new User({
                    name,
                    email,
                    password
                });
                //Hash Password
                bcrypt.genSalt(10,(error, salt)=>
                bcrypt.hash(newUser.password,salt, (error, hash)=>{
                    if(error) throw err;
                    //Convertir contraseña en hash
                    newUser.password=hash;
                    //Guardar usuario
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
