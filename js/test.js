console.log("We are executing test.js");
/*
 * Below is the nonblocking code
 */
var getImagefromHttp = function(url){
	console.log("Image download start");
	var image = new Image;
	image.src = url+"?time=" + (new Date()).getTime();
	console.log("Image download end");
};
var url = "https://upload.wikimedia.org/wikipedia/commons/b/b0/120_-_Qu%C3%A9bec_-_Septembre_2009.jpg";
/*
 * Depending on what we set to synchronous this method can be 
 * behave both blocking or Non-blocking code.
 */
var httpGet = function (theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
};
// var printThousends = function(someValue,function(){
// 			var count=0;
// 			for(var i=0;i<=1000000000;i++){
// 				count = count+i;
// 				if(i%1000===0){
// 					console.log("Count: "+count);
// 				}
// 			}

// 		})
// {
// 	return someValue;

// }


// var image = httpGet(url);
// var valueOfI = printThousends(300);

var changeCompany = function(obj){
	obj.company ="Oracle";

}
var employe = {
	name: "Rohit",
	age: 30,
	company: "Vymo"
};

console.log("Employe Before: ", employe);
changeCompany(employe);
console.log("Employe after: ", employe);


// console.log("Fetching is done" + valueOfI);