const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);


const app = express();

//Passport config
require('./config/passport')(passport);

//DB
const db = require('./config/db').MongoURI
//Conectar Mongo
mongoose.connect(db, {useNewUrlParser:true})
.then(()=>console.log('MongoDB conectado...'))
.catch(err => console.log(err));
var connection = mongoose.connection;

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store   : new MongoStore({
      mongooseConnection: connection
    })
  }));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Variables globales
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});

//ROUTES

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/curso', require('./routes/curso'));
app.use('/preguntas', require('./routes/preguntas'));
app.use('/api', require('./routes/api'));
app.use(express.static('public'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Servidor iniciado en el puerto : ${PORT}`));