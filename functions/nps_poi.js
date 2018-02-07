const request = require('request');
const async = require('async');
var admin = require("firebase-admin");

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: "senior-design-explr",
		clientEmail: "firebase-adminsdk-gb9os@senior-design-explr.iam.gserviceaccount.com",
		private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5JekjaVDvIu9G\nPRPc1yPczpT9uBeLM1RB7/w01mjMaEJC3HuYQ0PNm6hE9MWgkrrw6a6ln3Nd9FI+\ncLOhNU6fuVLh3Q6OtnNrcFH3yeW7nftxMwvpcHGE+TIN764ImJMmzuR8QEEtx+hn\ngBMehvvMZ/AcybEFd9BOue0dp9eu3ia1AqbO8r/X2glUlHHCRQ5LOx+YfWd0TLbs\nzzlBsMesO6L0GR2xEfFdKkBAAqH6oC+Ysn7JtmYQVSmqLU3qchU9SAR/9WldYjGc\nGufMOjpBxq1J3fujEwBJIgSVUSChjqOcWs8HvDHI0Ug+sSr0XDbSOk02K94+J00O\npB4G1Vs1AgMBAAECggEABr8jdgoZL62cxHkDSw4NObdc857FW/guTUPpHgirbg9l\nMPLAD4tU1CykcINEMMFkeH+QwNx9zkWnOgIjx8TWgn+03D5XyZGENoQlmkYFBvIr\nk/qFNkRUHN3INpkgDAYkKwP3qQb6YChcXGoJVopv/rOYqtzFS5VhU/ChX24ModoD\nvK37epEY3tMeT/jaT3E/igZqIhtgcFt0AXMzr+Uz1lFfdSUG6MN6D1xVh4EvJm07\n5eWr1obrHKs2R7rteTQQ2KmBCNgUIBcyCC28dNDRsSvxPrfriPgsZQEYY1jhWKz9\nfIppIMzibcvnqa5RDvnsZ95QmvZ8DH1dOb8MfYqwvQKBgQDf/xbRj/DUf1nFGGsk\nRcbd3XobOf6lA49+Aum0FsgljdTrFLJ329SJajGoL9C5GbyJ8J5h+JIb/QBAVJe/\n6d4asXnGhAvq9NebS1BXLgF2CZIXQJWphvOq2RIKjaENidPG8IYZfnbY6eKp0wE4\nPGYk1hkZyMNzll1k3qvM0ZwSDwKBgQDTmea32c+JhLEG3E8T1HdXqFkybpqAPpsk\nZtG1q4u+0NbMtXVjPO4cTwwgr6cHx/14gyQ7hpUEQznqPuhQNORrVdj+ka3P0BVx\nU/j2ChSreEP0PWYMAKO7RLbFHD2xFxMRfJFXUpMsA1TlT5FmoKE5WUdZJKKEOxTq\nlN+HeFJyewKBgACdfr6Mmqi6wNBdxM2Qs38ggJlai2yAmgBKmcG43kvcG92ZbPQP\nUoIeHIzNtNENVQs78fNq71vMUhfbI5+PUODZ4++7pRy8F2uBxXK32aEtXY1azA5v\nJHQvrHEC+pJC8qX1OykOw9zMp6a3waUZ5V3siJ0dhAvpOdBxHB+v47HZAoGAOprK\nWqsZnsXAXd0QjbZvozh+E8isQ86TG17awA0V9DBU/XdYXrbWX8LI4hikEzShkAoK\nM+5PQVH5LVZk8ynjBZNOORtR31eLSMrwDfy2wtLZR0DmDXbz4f7i++6Za32vi01L\n17qIBk2Z6rTB2YGthXujlh3eYO8YGOxIiHWbqBcCgYEA3fSqwCRP2vKU7+bdQSGD\nnODhBoYBAsnujF7YGfL9mS4pK3odDNeo6oSflztnm8RcBfu8HmrjXij85+lQhsTn\n/Zm07uf3VVTvpwUdgiyv8TB6WqE7X5ihQnj+sfxVGZDwgoQKcjWzV6F8W3+SYT5f\nz58icRK/qbnitd011lqtrtc=\n-----END PRIVATE KEY-----\n"
	}),
	databaseURL: "https://senior-design-explr.firebaseio.com/"
});

var db = admin.database();
var ref = db.ref("pois");

var config = {
  apiKey: 'AIzaSyAvhvYYE2ID6ZZuv823I1S1kKVrSOfrLfU'
}

var startNum = 101;
var stop = false;
var url = 'https://developer.nps.gov/api/v1/parks?api_key=ixWMRYRSzcQBgLHaFf2vZwjx3SWRSGQBsiE1CRab&fields=fullName,parkCode,latLong,designation,description,images&excludeDefaultFields=1&limit=100';

async.whilst(function () {
 	return !stop;
},
function (next) {
	console.log('start');
	requestURL = url + '&start=' + startNum.toString();
	request(requestURL, { json: true }, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if (body.data == null) {
				console.log('body');
				console.log(body);
			}
			console.log(body.data.length);
		  	if (body.data.length < 100) {
				stop = true;
			}
			startNum += 100;
			async.each(
                body.data, 
                function(item, callback) {
                	var curr = {}
                	designation = item.designation;
                	var select = false;

                	if (designation.includes("National Park")) {
                		select = true;
                		curr.type = "National Park";
                	} else if (designation.includes("National Monument")) {
                		select = true;
                		curr.type = "National Monument";
                	}

                	if (select) {
						curr.name = item.fullName;
						curr.description = item.description;
						if (item.images[0]) {
							curr.image = item.images[0].url;
						} else {
							curr.image = null;
						}
						
						latlong = item.latLong;

						if (latlong == "") {
							return callback(null);
						}

						latlong = extractLatLong(latlong);
						curr.lat = latlong[0];
						curr.long = latlong[1];

						var results = []
						var googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${curr.lat},${curr.long}&radius=50000&keyword=${curr.name}&key=${config.apiKey}`;
					    request(googlePlacesUrl, { json: true }, function (error, response, body) {
					    	console.log(curr.name);
					    	if (!error && response.statusCode == 200) {
					    		if (body.results.length > 0) {
						    		curr.id = body.results[0].place_id;
						    		ref.child(curr.id).set(curr);
						    	}
					    	}
					    	else {
					    		console.error(error);
					    	}
					    })
					}
					return callback(null);
                },
                function(err){
                	//console.error("err");
                }
            );
		}
		else {
			console.log('error');
			return;
		}
		next();
	});
},
function (err) {
  // All things are done!
});

function extractLatLong(latlong) {
	latlongArr = latlong.split(', ');
	lat = parseFloat(latlongArr[0].substring(4));
	long = parseFloat(latlongArr[1].substring(5));
	return [lat,long];
}
