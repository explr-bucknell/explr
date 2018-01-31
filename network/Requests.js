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
