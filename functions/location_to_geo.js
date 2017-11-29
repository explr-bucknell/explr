/// To grab from DB and turn into geofire
const fb = require("firebase");
const GeoFire = require("geofire");

var http = require('http');
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
    }).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');


var config = {
  apiKey: 'AIzaSyBztce7Z8iOrB5EgV4IE8gjlFGAy6MXSkQ',
  authDomain: 'senior-design-explr.firebaseapp.com',
  databaseURL: 'https://senior-design-explr.firebaseio.com',
  projectId: 'senior-design-explr',
  storageBucket: 'senior-design-explr.appspot.com',
  messagingSenderId: '866651490806'
}

const firebaseApp = fb.initializeApp(config);
//instantiation of db
var ref = fb.database().ref("national_monuments/");
var ref2 = fb.database().ref("national_parks/");
//instantiation of geofire DB
var geoFireRef = fb.database().ref("geo_data/");
var geoFire = new GeoFire(geoFireRef);

ref.on("value", function(snapshot) {
	//console.log(snapshot.val());
  var temp = snapshot.val();
  //code to write to database
  for (var key in temp) {
    if (temp.hasOwnProperty(key)) {
	geoFire.set(key, [temp[key].lat, temp[key].long]);
    }
}


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

ref2.on("value", function(snapshot) {
	//console.log(snapshot.val());
  var temp = snapshot.val();
  //code to write to database
  for (var key in temp) {
    if (temp.hasOwnProperty(key)) {
	geoFire.set(key, [temp[key].lat, temp[key].long]);
    }
}


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
