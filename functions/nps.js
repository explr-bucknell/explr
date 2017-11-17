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
var npRef = db.ref("national_parks");
var nmRef = db.ref("national_monuments");

var startNum = 1;
var stop = false;

async.whilst(function () {
 	return !stop;
},
function (next) {
	requestURL = 'https://developer.nps.gov/api/v1/parks?api_key=ixWMRYRSzcQBgLHaFf2vZwjx3SWRSGQBsiE1CRab&fields=fullName,parkCode,latLong,designation,description,images&excludeDefaultFields=1&limit=100';
	requestURL += '&start=' + startNum.toString();
	request(requestURL, { json: true }, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body.data.length);
		  	if (body.data.length < 100) {
				stop = true;
			}
			startNum += 100;
			extractNPSData(body.data, npRef, nmRef);
		}
		else {
			return;
		}
		next();
	});
},
function (err) {
  // All things are done!
});

/*
while (!stop) {
	requestURL = 'https://developer.nps.gov/api/v1/parks?api_key=ixWMRYRSzcQBgLHaFf2vZwjx3SWRSGQBsiE1CRab&fields=fullName,parkCode,latLong,designation&excludeDefaultFields=1&limit=100';
	requestURL += '&start=' + startNum.toString();
	request('https://developer.nps.gov/api/v1/parks?api_key=ixWMRYRSzcQBgLHaFf2vZwjx3SWRSGQBsiE1CRab&limit=100', { json: true }, (err, res, body) => {
		if (err) { return console.log(err); }
		console.log(body.data.length);
		if (body.data.length < 100) {
			stop = true;
		}
		startNum += 100;
		extractNPSData(body.data, ref);
	});
}
*/

function extractNPSData(rawData, npRef, nmRef) {
	for (i = 0; i < rawData.length; i++) {
		curr = {}
		designation = rawData[i].designation;

		myRef = null;
		if (designation.includes("National Park")) {
			myRef = npRef;
		} else if (designation.includes("National Monument")) {
			myRef = nmRef;
		}

		code = rawData[i].parkCode;
		curr.name = rawData[i].fullName;
		curr.description = rawData[i].description;
		if (rawData[i].images[0]) {
			curr.image = rawData[i].images[0].url;
		} else {
			curr.image = null;
		}
		
		latlong = rawData[i].latLong;

		if (latlong == "") {
			continue;
		}

		latlong = extractLatLong(latlong);
		curr.lat = latlong[0];
		curr.long = latlong[1];

		if (myRef) {
			myRef.child(code).set(curr);
		}
	}
	return;
}

function extractLatLong(latlong) {
	latlongArr = latlong.split(', ');
	lat = parseFloat(latlongArr[0].substring(4));
	long = parseFloat(latlongArr[1].substring(5));
	return [lat,long];
}
