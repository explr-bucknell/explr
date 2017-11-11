
//constructor function
function Location(name, loc_Type, east, north, latitude, longitude, state, id) {
  this.Name = name; //Name of the location.  ex/ Milton State Park
  this.Loc_Type = loc_Type; // BE SPECIFIC.  this should be an enum .  State Park, National Park, etc
  this.East = east; //1 hot encoding as to whether the longitude is East
  this.North = north; //1 hot encoding as to wther the latitude is north
  this.Latitude = latitude; // in the form 44.3386
  this.Longitude = longitude; // in the form 44.3386
  this.State = state; //state the location lives in
  this.Unique_ID = id; //should be a unique number.  Maybe assigned by DB but who knows
}

/// Database Operations
function writeLocation(location) { //should be a location
  firebase.database().ref('locations/' + location.Unique_ID).set({location});
}

function readLocation(Unique_ID) {
  return firebase.database().ref('locations/' + Unique+ID).once('value').then(function(snapshot) {
    var location = snapshot.val()
  })
}
