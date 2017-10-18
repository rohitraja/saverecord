var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


//user Schema

var UserSchema = mongoose.Schema({
	username:{
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function(newUser,callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
	    });
	});
}

module.exports.getUserByUserName = function(username,callback){
	var query ={ username : username};
	console.log("Query :"+ JSON.stringify(query));
	User.findOne(query,callback);
	console.log("Executed");
}


module.exports.getUserById = function(id,callback){
	console.log("Id getUserById -> "+ JSON.stringify(id));
	var query = {_id: id };
	User.findOne(query,callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if(err) throw err;
		callback(null,isMatch);

	});
}

