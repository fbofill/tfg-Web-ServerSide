const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');



//User model
const User = require ('../models/User');
const Curso = require ('../models/Curso');


//GET CURSOS
router.get ('/getCursos/', (req, res)=>
Curso.find({}, function(err, cursos) {
 res.json(cursos);
 })
);


//API REGISTER HANDLE
router.post('/register',(req, res)=>{

const {name,email,password,password2}=req.body;
     //Validacion en cliente
     User.findOne({email:email})
     .then(user => {
         if(user){
             //Existe el usuario
             res.json('El email ya está registrado');
             console.log('El email ya está registrado');
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
                    res.json('Ya te has registrado y puedes iniciar session');
                    console.log('Ya te has registrado y puedes iniciar session');
                 })
                 .catch(err =>console.log(err));
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
            res.status(400);
        }else{
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    res.json(user);
                } else {
                    res.status(400);
                }
              });
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