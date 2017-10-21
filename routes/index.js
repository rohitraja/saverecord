var express = require('express');
var router = express.Router();


//Get Homepage
router.get('/',ensureAuthenticated,function(req,res){
	console.log(" render Index");
	res.render('index');
});


function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error', 'You are not logged in ');
		res.redirect('/users/login');
	}
}


module.exports = router;