import React from 'react';
import firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyBztce7Z8iOrB5EgV4IE8gjlFGAy6MXSkQ'
}

export async function createTrip(uid, tripName) {
  var tripId = firebase.database().ref(`users/main/${uid}/trips/`).push().key
  await firebase.database().ref(`users/main/${uid}/trips/${tripId}`).update({
    name: tripName,
    numLocs: 0,
    creator: uid,
    locations: {}
  })
}

export async function createTripWithLocation(uid, tripName, locationId, locationName) {
  var tripId = firebase.database().ref(`users/main/${uid}/trips/`).push().key
  await firebase.database().ref(`users/main/${uid}/trips/${tripId}`).update({
    name: tripName,
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
}

//Add a new location to a trip
export async function addLocationToTrip(uid, tripId, locationId, locationName) {
  await firebase.database().ref(`users/main/${uid}/trips/${tripId}/locations/${locationId}`).set({
    visited: false,
    name: locationName,
  });

  firebase.database().ref(`users/main/${uid}/trips/${tripId}`).once('value').then(function(snapshot) {
    var numLocations = snapshot.val().numLocs
    firebase.database().ref(`users/main/${uid}/trips/${tripId}`).update({
      numLocs: numLocations + 1
    });
  });
}

export async function getTrips(uid) {
  try {
    let trips = await fetch(`https://senior-design-explr.firebaseio.com/users/main/${uid}/trips.json`)
    let tripsJson = await trips.json()
    return tripsJson
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getTrip (uid, tripId) {
  try {
    let trip = await fetch(`https://senior-design-explr.firebaseio.com/users/main/${uid}/trips/${tripId}.json`)
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

export async function submitPoiToFirebase (poi, photoUrl) {
  firebase.database().ref('pois/' + poi.place_id).set({
    name: poi.name,
    id: poi.place_id,
    image: photoUrl.url,
    lat: poi.geometry.location.lat,
    long: poi.geometry.location.lng,
    description: poi.name // FIX THIS
  })
}
