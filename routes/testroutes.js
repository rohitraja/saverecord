var express = require('express');
var router = express.Router();




router.get('/getloggedInUser',function(req,res){

	var response = {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	}
	res.json(response);
});


module.exports = router;