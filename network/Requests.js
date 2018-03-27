import React from 'react';
import firebase from 'firebase';
const fetch = require('node-fetch');
import { types } from '../utils/poiTypes'

var config = {
  apiKey: 'AIzaSyBztce7Z8iOrB5EgV4IE8gjlFGAy6MXSkQ'
}

export async function createTrip(uid, tripName, tripTags, permission) {
  var tripId = firebase.database().ref(`trips/`).push().key
  await firebase.database().ref(`trips/${tripId}`).update({
    name: tripName,
    tags: tripTags,
    permission: permission,
    numLocs: 0,
    creator: uid,
    locations: {}
  })

  tripTags.forEach(tag => {
    firebase.database().ref(`tags/${tag}/trips`).update({
      [tripId]: Date.now()
    })
    firebase.database().ref(`tags/${tag}/count`).transaction(function(count) {
      count = count ? count + 1 : 1
      return count
    })
  })
}

export async function createTripWithLocation(uid, tripName, tripTags, permission, locationId, locationName) {
  var tripId = firebase.database().ref(`trips/`).push().key
  await firebase.database().ref(`trips/${tripId}`).update({
    name: tripName,
    tags: tripTags,
    permission: permission,
    numLocs: 1,
    creator: uid,
    locations: {
      [locationId]: {
        visited: false,
        name: locationName,
        index: 0
      }
    }
  })

  tripTags.forEach(tag => {
    firebase.database().ref(`tags/${tag}/trips`).update({
      [tripId]: Date.now()
    })
    firebase.database().ref(`tags/${tag}/count`).transaction(function(count) {
      count = count ? count + 1 : 1
      return count
    })
  })
}

//Add a new location to a trip
export async function addLocationToTrip(tripId, locationId, locationName) {
  var numLocations = 0;
  await firebase.database().ref(`trips/${tripId}/numLocs/`).transaction(function(numLocs) {
    numLocations = numLocs;
    return numLocs + 1;
  });

  await firebase.database().ref(`trips/${tripId}/locations/${locationId}`).set({
    visited: false,
    name: locationName,
    index: numLocations
  });
}

export async function getTrips(uid, callback) {
  firebase.database().ref('trips/').orderByChild('creator').equalTo(uid).on('value', function(snapshot) {
    if (snapshot.numChildren()) {
      callback(snapshot.val())
    }
  })
}

export async function getTrip (tripId) {
  try {
    let trip = await fetch(`https://senior-design-explr.firebaseio.com/trips/${tripId}.json`)
    let tripJson = await trip.json()
    return tripJson
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getLocations (locationType) {
  try {
    let locations = await fetch(`https://senior-design-explr.firebaseio.com/${locationType}.json`);
    let locationsJson = await locations.json();
    return locationsJson
  } catch (error) {
    // Handle error
    console.error(error);
  }
}

export async function getLocation (locationId) {
  try {
    let location = await fetch (`https://senior-design-explr.firebaseio.com/pois/${locationId}.json`)
    let locationJson = await location.json()
    return locationJson
  } catch (error) {
    console.error(error)
  }
}

export async function getPOIFromLatLng (lat, lng, selectedFilter) {
  try {
    let pointsOfInterest = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&type=${selectedFilter}&key=${config.apiKey}`
    )
    let poiJson = await pointsOfInterest.json();
    return poiJson
  } catch (error) {
    console.error(error)
  }
}

export async function getPOIDetails (placeId) {
  try {
    let poiDetail = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${config.apiKey}`
    )
    let poiDetailJson = await poiDetail.json()
    return poiDetailJson
  } catch (error) {
    console.error(error)
  }
}

export async function getPOIAutocomplete (query) {
  const BONSAI_URL = 'https://explrelasticsearch.herokuapp.com'
  let resp = await fetch(
    `${BONSAI_URL}/search_places?q=${query}`
  )
  let data = JSON.parse(resp._bodyText).hits.hits
  var results = []
  data.forEach(function(poi) {
    results.push(poi._source)
  })
  return results
}

/*
// This is the old version of autocomplete using Google Places API
export async function getPOIAutocomplete (query) {
  try {
    var results = []
    let poi = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${config.apiKey}`
    )
    let poiJson = await poi.json()
    for (i in poiJson.results) {
      var id = poiJson.results[i].place_id
      //console.log("id", id)
      var firebaseInstance = await fetch(
        `https://senior-design-explr.firebaseio.com/pois.json?orderBy="id"&equalTo="${id}"`
      )
      var firebaseJson = await firebaseInstance.json()
      //console.log(firebaseJson)
      if (Object.keys(firebaseJson).length > 0) {
        results.push({
          name: poiJson.results[i].name,
          placeId: poiJson.results[i].place_id
        })
      }
    }
    //console.log("results", results)
    return results
  } catch (error) {
    console.error(error)
  }
}
*/

export async function makePhotoRequest (photoReference) {
  try {
    let photoUrl = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?&maxheight=400&photoreference=${photoReference}&key=${config.apiKey}`
    )
    return photoUrl
  } catch (error) {
    console.error(error)
  }
}

function getMatchingType (poiTypes) {
  for (i = 0; i < poiTypes.length; i++) {
    if (Object.keys(types).includes(poiTypes[i])) {
      return poiTypes[i]
    }
  }
  return 'park'
}

export async function submitPoiToFirebase (poi, photoUrl) {
  let defaultPic = 'https://picsum.photos/200/300/?image=693'
  let type = getMatchingType(poi.types)
  firebase.database().ref('pois/' + poi.place_id).set({
    name: poi.name,
    id: poi.place_id,
    image: photoUrl ? photoUrl.url : types[poi.type].defaultPic,
    lat: poi.geometry.location.lat,
    long: poi.geometry.location.lng,
    description: poi.name, // FIX THIS,
    type: type
  })
}

export async function uploadNewProfilePic(base64, uid) {
  var url = 'https://us-central1-senior-design-explr.cloudfunctions.net/profileImageUpload'
  await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid: uid,
      base64: base64
    }),
  })
}

export async function calculateDistance(trip) {
  var urlStart = "";
  var urlEnd = "&destinations=";
  for (var i = 0; i < trip.length; i++) {
    if (i == 0) {
      urlStart += "origins=place_id:" + trip[i].locId;
    } else {
      urlEnd += "place_id:" + trip[i].locId + "|"
    }
  }

  var urlWaypoints = urlStart + urlEnd;
  var urlFinal = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&" + urlWaypoints + "&key=AIzaSyBbEBNs_oq5jkeq2rRkSd1mKBkVGX7RjGg";
  console.log(urlFinal);

  fetch(urlFinal).then(function(response) {
    googleRet = response.json();
  
    var arr = googleRet.rows[0].elements;
    var distance = 0;
    var parsed = "";

    for (var i = 0; i < arr.length; i++) {
      parsed = (arr[i].distance.text);
      parsed = parseFloat(parsed.replace(",","").replace(" mi",""));
      distance += parsed; 
    }
    
    return distance;
  })
}
  
export async function optimizeTrip(trip, uid, tripID, tripName) {
   var urlStart = "";
   var urlEnd = "&waypoints=";
   for (var i = 0; i < trip.length; i++) {
     if (i == 0) {
       urlStart += "origin=place_id:" + trip[i].locId;
     } else if (i == trip.length - 1) {
       urlStart += "&destination=place_id:" + trip[i].locId;    
     } else {
       urlEnd += "place_id:" + trip[i].locId + "|"
     }
   }

   var urlWaypoints = urlStart + urlEnd;
   var urlFinal = "https://maps.googleapis.com/maps/api/directions/json?" + urlWaypoints + "&key=AIzaSyBbEBNs_oq5jkeq2rRkSd1mKBkVGX7RjGg";
   console.log(urlFinal);
  
  fetch(urlFinal).then(function(response) {
    googleRet = response.json();

    var waypointArr = googleRet.routes[0].waypoint_order;
    console.log(waypointArr[1]);
    var dist = googleRet.routes[0].legs[0].distance.text;
    var parsed = parseFloat(dist.replace(",","").replace(" mi",""));
    console.log(parsed);

    var resArray = [];
    for (var i = 0; i < trip.length; i++) {
     if (i != 0 && i != trip.length - 1) {
       resArray.push(trip[waypointArr[i-1]+1]);
     } else {
       resArray.push(trip[i]);    
     }
    }


    recreateTrip(tripID);
    addAllLocations(tripID, tripName, resArray);
  })
}



export async function recreateTrip(tripID) {
  await firebase.database().ref('trips/${tripId}').update({
    locations: {}
  })
}

export async function addAllLocations(tripId, tripName, locationArray) {  
  for (var i = 0; i < locationArray.length; i++) {
    addLocationToTrip(tripID, locationArray[i].locID, locationArray[i].name)
  }
}
