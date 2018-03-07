const request = require('request');
const async = require('async');
var admin = require("firebase-admin");

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: "senior-design-explr",
		clientEmail: "firebase-adminsdk-gb9os@senior-design-explr.iam.gserviceaccount.com",
		private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCc0Pdm5ygJnkdF\n18p98SINd6A/qmsKb3IFwaBoxjPiW5DKNcGTjbCCR2YwHBgcDkzhMxB+sHtyhpwM\nNABfZrnEiRdg0uJlWE7Ph4EnPeM7Jky6tnoAruh782OJN/dMTyQ5x8JLn4Knbpgs\nm1T2IEu1KlY0Ma5sjaR/lfG3U0PNDg63z/MyPB0W0zIeF4tOVDhzBngkF6HmhB17\nVjV/huS4LDlmNcjJW4tC5apYg+FJKnTjC8C9DgHanblgg/JFYiXuMao0+FDDSD6a\nm2wTVfDh9QB/8cMZBmVMpB197C2cSrqgtUlPxja1VtrqVO4ouPDJNMt741PfqHY9\ned/a4ZrbAgMBAAECggEAIH3ftQ+SKSQFaoBCsYOj5ZxytJ5P3XKn8m9jGDJxD6af\nQnaO7E7AUs4Oa0t252FDJqoY8dcJTPp9HL4tkZbMSN+K24H2bL82XSObbBETou7V\nmR4z+y5Cd2Q/rG/PKp1/SQWNyXN8c8qjdyKcIP8iEKB8CgZ9OHrEqbbcxXpYIwVC\nMFnSWXkwGgtHPV2DUCN10ECB1UZ+14bSI35UbraqdlMu9AakkBiVm0R38ALMaZ2y\nahuP8QmI1UkII8BGnXjQi1ONEEhbbXDkQAdAFWqOzeuegZkUd+pOunD9O2xXEhVb\nlREdigVVe+FD+ryinH1VlVkSCqjq+HLMTSvia6WaOQKBgQDdV30WrngY1sxApAmo\nr4EGT1ie5BkmlXCk7oT5v13/qXpsbMI0pIY8fWG8xKE+IbvqUE3Dds0XIu0wHGbg\nVDADLFiHo2kE8GwlPuw5KcA9VODKfETcHe2KNUq9p32A898eTdgEAKJB4U7RtQlE\nWmj72inKbMdQlK+ibrfMoKlEPQKBgQC1XvdRkLA/iYuVyMTH4AWNWpc+InIfIHr1\nl/z0PeLamCfjbIkdvEE+ovAtEHfxNworVVbryWcFPyEnYyMdaMn0rb/deg+50FPW\nhuxCrfXrzGDNHTqA0Yf/tTBRyN3R/zqLJBPpwhZfeT3mjpbEAjvId2RNP2RNBMTk\nn/GI7uwU9wKBgE2uu/cu6nWFRZBWQhGS7wyg4nB5i54wCqXIFKF2mW32NEJDdXF2\nYKpwMtJGjHS68DHPV0uHsXkyR95/yVdoFKW4daW9I0mZe8sip1N0pMShunc2YBCE\n7G56P64KT5DnhmIjXfIhqtDGW5xcFlGIDZp+ufYScW2FkZLHmvhVVrLdAoGAMVA3\n2IKJmUzxmfEzp9C+Ubeu5aMB+nqfVAVWLqZg9uRl/Az3nxEfgENXIDmZEwnPBwc2\nEff5vdBzWD05P/bM6m0PfM2CVxhQo0SeGmcoNUulij+HN51A6ALAt4vw2/cUWN6f\nV3CBGsZhUT21umeND61+pQ42XEaOrkbaqkuj/vMCgYAOLF4bW2g6p7M23B7rzc06\nIxwMnJh8fkUji0N6RS6fJ7U6Brhi6tNW+vWExi6c17NdzjlAKH5HG9do+Rs1DAg+\n4d+35tKKr6/rX7QekkYZNGycGY1V/H1poAfDh7lvRhKgZBKpymFrq7UvsmfwwK76\nF5yRNO1izuIIXwse6QRz5A==\n-----END PRIVATE KEY-----\n",
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
						var googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${curr.name}&key=${config.apiKey}`;
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
