var express = require('express');
var router = express.Router();



router.get('/getvariables',function(req,res,next){
	console.log("Process Environment -> "+ JSON.stringify(process.env));
	res.json(process.env);
});



module.exports = router;