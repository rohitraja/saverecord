const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 8000;

app.use(cookieParser());

app.get('/', function (req, res) {
	res.cookie('user','rohit');
  res.send('Hello World!')
});

app.get('/hi',function(req,res){
	res.send("Hi to you. Whats your good name");
})

app.listen(port, function () {
  console.log('Example app listening on port 8000!')
})
