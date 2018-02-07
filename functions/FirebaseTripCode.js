  //Add a new trip
  async addNewTrip(tripID) {
    console.log('adding location to trip');
    await firebase.database().ref('trips/' + this.props.uid + '/' + tripID).set({
      numLocs: 1,
      originalCreator: 'null'
    });

    await firebase.database().ref('trips/' + this.props.uid + '/' + tripID + '/' + 'locationID').set({ //access the trips section, specific user, specific trip, then add the new location
      visited: false
    });
  }

  //Delete a trip
  async removeTrip() {
    console.log('removing location from trip');

    await firebase.database().ref('trips/' + this.props.uid + '/' + 'tripID').set(null);
  }

  //Add a brand new location
  async addLocation() {
    await firebase.database().ref('trips/' + this.props.uid + '/' + 'tripID' + '/' + 'locationID').set({
      visited: false
    });

    var numLocations;
    await firebase.database().ref('trips/userID/tripID').once('value').then(function(snapshot) {
      numLocations = (snapshot.val() && snapshot.val().numLocs) || 'Failed';
      console.log(numLocations);
    });

    await firebase.database().ref('trips/' + this.props.uid + '/' + 'tripID').update({
      numLocs: numLocations + 1
    });
  }

  //Remove a location
  async removeLocation(locationID) {
    console.log("Remove a location from the trip");

    await firebase.database().ref('trips/' + this.props.uid + '/' + 'tripID' + '/' + locationID).set(null);

    var numLocations;
    await firebase.database().ref('trips/' + this.props.userID + '/tripID').once('value').then(function(snapshot) {
      numLocations = (snapshot.val() && snapshot.val().numLocs) || 'Failed';
      console.log(numLocations);
    });

    await firebase.database().ref('trips/' + this.props.uid + '/' + 'tripID').update({
      numLocs: numLocations - 1
    });
  }

  //Mark a location as visited
  async markVisited() {
    console.log("Mark location as visited");

    await firebase.database().ref('trips/' + this.props.uid + '/' + 'tripID' + '/' + 'locationID').update({
      visited: true
    });
  }

  //Make a trip public
  async makePublic(tripID) {
    console.log("Making a trip public");

    await firebase.database().ref('trips/' + this.props.uid + '/' + tripID).update({
      originalCreator: this.props.uid
    });

    var oldRef = firebase.database().ref('trips/' + this.props.uid + '/' + tripID);
    var newRef = firebase.database().ref('trips/' + 'publicUserID' + '/' + tripID);

    oldRef.once('value', function(snap)  {
      newRef.set( snap.val(), function(error) {
         if( !error ) {  oldRef.remove(); }
         else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
      });
    });
  }

  //Copy trip to your profile
  //Still need to make it so that it resets all visited points to false
  async copyTripToProfile(tripID) {
    console.log("Making a trip public");

    await firebase.database().ref('trips/' + this.props.uid + '/' + 'tripID').update({
      originalCreator: this.props.uid
    });

    var oldRef = firebase.database().ref('trips/' + 'publicUserID' + '/' + tripID);
    var newRef = firebase.database().ref('trips/' + this.props.uid + '/' + tripID);

    oldRef.once('value', function(snap)  {
        newRef.set( snap.val(), function(error) {
             if( error && typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
        });
    });   
  }