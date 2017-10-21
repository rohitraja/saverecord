var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').strategy;
var mogno = require('mongo');
var mongoose = require('mongoose');
var dbUri = process.env.MONGODB_URI || 'mongodb://localhost/loginapp'
mongoose.connect(dbUri);
var db = mongoose.connection;
var routes = require('./routes/index');
var users = require('./routes/users');
var facebookAuth = require('./routes/facebookAuth');
var environment = require('./routes/environment');

//Init App
var app = express();
// View Engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

//Express Sessions
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

//Express Validator

app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.');
		var root = namespace.shift();
		var formParam = root;
		while(namespace.length){
			formParam += '[' + namespace.shift() +']';
		}
		return {
			param: formParam,
			msg		: msg,
			value 	: value
		};
	}
}));

// Connect Flash
app.use(flash());


// Global Vars

app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});


app.use('/', routes);
app.use('/users',users);
app.use('/environment',environment);
app.use('/facebook',facebookAuth);


//set Port
app.set('port',(process.env.PORT || 3000));
app.listen(app.get('port'),function(){
	console.log( 'Server strt on port' + app.get('port'));
});