module.exports={
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Inicia sesion para visitar esta página');
        res.redirect('/user/login');
    }
}