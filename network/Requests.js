import React from 'react';
import firebase from 'firebase';
import GeoFire from 'geofire';

var config = {
  apiKey: 'AIzaSyBztce7Z8iOrB5EgV4IE8gjlFGAy6MXSkQ'
}

export async function createTrip(uid, tripName) {
  console.log('creating trip')
  var tripId = firebase.database().ref(`users/main/${uid}/trips/`).push().key
  await firebase.database().ref(`users/main/${uid}/trips/${tripId}`).update({
    name: tripName,
    numLocs: 0,
    creator: uid,
    locations: {}
  })
}

//Add a new location to a trip
export async function addLocation(uid, tripId, locationId) {
  await firebase.database().ref(`users/main/${uid}/trips/${tripId}/${locationId}`).set({
    visited: false
  });

  var numLocations;
  firebase.database().ref(`users/main/${uid}/trips/${tripID}`).once('value').then(function(snapshot) {
    console.log(snapshot)
    //numLocations = (snapshot.val() && snapshot.val().numLocs) || 'Failed';
    console.log(numLocations);
  });

  // await firebase.database().ref('trips/' + this.props.uid + '/' + 'tripID').update({
  //   numLocs: numLocations + 1
  // });
}

export async function getTrips(uid) {
  try {
    let trips = await fetch(`https://senior-design-explr.firebaseio.com/users/main/${uid}/trips.json`)
    let tripsJson = await trips.json()
    console.log(tripsJson)
    return tripsJson
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
  console.log(query)
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
}

/**
    work in progress ... something along these lines
    function to grab all points in circular area
    center: should be in form [34.1, -34.1]
    radius: should be in form 10.5
  **/
export async function getInArea(center, radius){
    /** should we export this somewhere?
    configs and such for firebase .. .  here for now.. should only be max 1 place.
    **/
    var config = {
      apiKey: 'AIzaSyBztce7Z8iOrB5EgV4IE8gjlFGAy6MXSkQ',
      authDomain: 'senior-design-explr.firebaseapp.com',
      databaseURL: 'https://senior-design-explr.firebaseio.com',
      projectId: 'senior-design-explr',
      storageBucket: 'senior-design-explr.appspot.com',
      messagingSenderId: '866651490806'
    }
    const firebaseApp = firebase.initializeApp(config);
    var firebaseRef = firebase.database().ref('geo_data/');
    // Create a GeoFire index
    var geoFire = new GeoFire(firebaseRef);
    var geoQuery  = geoFire.query(center: center, radius: radius);
    var  onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location) {
      console.log("the key: " + key + "\n the location: " + location);
      console.log("type of key: " + key.type);
      console.log("latitude  of location: " + location[0]);
    });
  }
