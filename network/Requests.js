import React from 'react';
import firebase from 'firebase';
import GeoFire from 'geofire';

var config = {
  apiKey: 'AIzaSyBztce7Z8iOrB5EgV4IE8gjlFGAy6MXSkQ'
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
  try {
    var results = []
    let poi = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${config.apiKey}`
    )
    let poiJson = await poi.json()
    for (i in poiJson.predictions) {
      var id = poiJson.predictions[i].place_id
      var firebaseInstance = await fetch(
        `https://senior-design-explr.firebaseio.com/pois.json?orderBy="id"&equalTo="${id}"`
      )
      var firebaseJson = await firebaseInstance.json()
      if (Object.keys(firebaseJson).length > 0) {
        results.push(poiJson.predictions[i])
      }
    }
    return results
  } catch (error) {
    console.error(error)
  }
}

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

export async function submitPoiToFirebase (poi, photoUrl) {
  firebase.database().ref('pois/' + poi.place_id).set({
    name: poi.name,
    id: poi.place_id,
    image: photoUrl.url,
    lat: poi.geometry.location.lat,
    long: poi.geometry.location.lng,
    description: poi.name // FIX THIS
  })
    //adding to geoFire
    var geoFire = new GeoFire(firebase.database().ref('geo_data/'))
    geoFire.set(poi.place_id, [poi.geometry.location.lat, poi.geometry.location.lng])
}

export async function geoQuery(lat, long, latDelta, longDelta) {
	console.log("geoQuery", lat, long, latDelta, longDelta)
	var ref = firebase.database().ref('pois/')
	var res = {}
	ref.orderByChild("lat").startAt(lat - latDelta/2).endAt(lat + latDelta/2).on("value", function(querySnapshot) {
    if (querySnapshot.numChildren()) {
      querySnapshot.forEach(function(poiSnapshot) {
        if ((long - longDelta/2) <= poiSnapshot.val().long && poiSnapshot.val().long <= (long + longDelta/2)) {
      		res[poiSnapshot.key] = poiSnapshot.val()
        }
      });
      console.log("res", res)
      return res
    } else {
      console.log("no poi in this area")
    }
  })
}

/**
    work in progress ... something along these lines
    function to grab all points in circular area
    center: should be in form [34.1, -34.1]
    radius: should be in form 10.5
  **/
export async function geoQuery2(center, radius, postKey) {
	var geoQueryRef = firebase.database().ref('geoquery/')
	var newPostKey = postKey ? postKey : geoQueryRef.push().key

  var firebaseRef = firebase.database().ref('geo_data/')
  // Create a GeoFire index
  var geoFire = new GeoFire(firebaseRef)
  var geoQuery  = geoFire.query({center, radius})
  geoQuery.on("key_entered", function(key, location) {
    getLocation(key).then((data) => {
    	//console.log("the key: " + key + "\n the location: " + location)
    	//console.log(data)
    	var updates = {}
			updates[key] = " "
			geoQueryRef.child(newPostKey).update(updates)
    })
  });
  return newPostKey
}
