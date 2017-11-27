import React from 'react'

export async function getLocations (locationType) {
  try {
    let locations = await fetch(`https://senior-design-explr.firebaseio.com/${locationType}.json`);
    let locationsJson = await locations.json();
    return locationsJson
  } catch(error) {
    // Handle error
    console.error(error);
  }
}
