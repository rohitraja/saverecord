var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var facebookAppConfig = require('../config/facebookAppConfig');
var User = require('../models/user');
var prodAppConfig = require('../config/prodConfig');


var clientID = process.env.FACEBOOK_CLIENT_ID || facebookAppConfig.facebookAuth.clientID;
var clientSecret = process.env.FACEBOOK_CLIENT_SECRET || facebookAppConfig.facebookAuth.clientSecretID;
var callbackURL = (process.env.NODE_ENV ==='production') ? prodAppConfig.callbackURL: facebookAppConfig.facebookAuth.callbackURL;


passport.use(new FacebookStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },
  function(accessToken, refreshToken, profile, done) {
  		console.log("accessToken--> "+ accessToken);
  		console.log("refreshToken--> "+ refreshToken);
  		console.log("profile--> "+ JSON.stringify(profile));
  		process.nextTick(function(){
  			User.findOne({'facebook.profile_id' :profile.id},function(err,user){
  				if(err){
  					return done(err);
  				}
  				if(user){
  					return done(null,user);
  				}else{
  					var newUser = new User({
  						name : profile._json.first_name + ' '+ profile._json.last_name  ,
  						email : profile.emails[0].value,
  						'facebook.profile_id' : profile.id,
  						'facebook.token' : accessToken	
  					});

  					console.log("newUse---->before save "+ JSON.stringify(newUser));

  					newUser.save(function(err){
  						if(err){
  							throw err;
  						}else{
  							return done(null,newUser);
  						}
  					});
  				}
  			})
  		})
  }
));



// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth', passport.authenticate('facebook', { scope : ['email']}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));



module.exports = router;