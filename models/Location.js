// ./models/Location

// Location object, and method to create a location within the database
import firebase from 'firebase';
import GeoFire from 'geofire';

var config = {
  apiKey: 'AIzaSyBztce7Z8iOrB5EgV4IE8gjlFGAy6MXSkQ',
  authDomain: 'senior-design-explr.firebaseapp.com',
  databaseURL: 'https://senior-design-explr.firebaseio.com',
  projectId: 'senior-design-explr',
  storageBucket: 'senior-design-explr.appspot.com',
  messagingSenderId: '866651490806'
}
const firebaseApp = firebase.initializeApp(config);

var firebaseRef = firebase.database().ref('points/');

// Create a GeoFire index
var geoFire = new GeoFire(firebaseRef);
export class Location {
    name: string; //Name of the location.  ex/ Milton State Park
    locType: string; // BE SPECIFIC.  this should be an enum .  State Park, National Park, etc
    east: number; //1 hot encoding as to whether the longitude is East
    north: number; //1 hot encoding as to wther the latitude is north
    latitude: number; // in the form 44.3386
    longitude: number; // in the form 44.3386
    state: string; //state the location lives in
    key: string; //set by databse

    constructor(name, locType, east, north, latitude, longitude, state) {
	this.name = name;
	this.locType = locType;
	this.east = east;
	this.north = north;
	this.latitude = latitude;
	this.longitude = longitude;
	this.state = state;
    }

    /// Database Operations

    writeLocation() { //should be a location
	//search in geobase if already exists
	//if so return unique id?
	// else add in regular db, add in goebase with same unique key.
	var pushed = firebase.database().ref('locations/').push(
								   {
								       name:this.name,
									   locType:this.locType,
									   east:this.east,
									   north:this.north,
									   latitude:this.latitude,
									   longitude:this.longitude,
									   state:this.state
									   });
	this.key = pushed.key;
	geoFire.set(this.key, [this.longitude, this.latitude]);
    }

    // For reading: see specific API for creating a listener :
    // Geofire: https://github.com/firebase/geofire-js/blob/master/docs/reference.md#geofiresetkeyorlocations-location
    // Firebase: https://firebase.google.com/docs/database/admin/retrieve-data
}


//Sample Usage:
/**
import React from 'react';
//testing DB interaction
import { Location }  from './models/Location';
import firebase from 'firebase';
import {
    Button,
	Alert,
	AppRegistry,
	ActivityIndicator,
	StyleSheet,
	Navigator,
	Text,
	View,
	ToolbarAndroid
	} from 'react-native';





//not working.. probably want to do in a different way anyway
function readLocation(name) {
    return firebase.database().ref('locations/' + name).once('value');
}


export default class App extends React.Component {


    _onPressWrite() {
	//Works!!
	var newLocation = new Location("Acadia", "National Park", 0, 1, 44.3386, 68.2733, "Maine", 1); //declare object
	//var anotherLocation = createLocation("Milton State Park", "State Park", 0, 1, 22.2, 45.2, "PA", 2);
	newLocation.writeLocation();

	//end testing

	Alert.alert('Writing to the Database!');
    }
    _onPressRead() {
	var oldLocation = readLocation("Acadia");
	console.log(oldLocation);
	Alert.alert('picked up ' + oldLocation.name);

    }
    constructor(props) {
    	super(props);
    	this.state={
    	    openingPage:null
    	}
     }
    render() {
	return (
		<View style={styles.container}>
		<Button
		    onPress={this._onPressWrite}
		    title="Write To Database"
		    color="#841584"
		    accessibilityLabel="database related button"
		/>
		<Text> another button? </Text>
		<Button
		    onPress={this._onPressRead}
		    title="Read from Database"
		    color="#841584"
		    accessibilityLabel="database related button"
		/>
		<Text>Open up App.js IF STATEMENT added button    </Text>
		</View>
		);
    }
}

const styles = StyleSheet.create({
	container: {
	    alignItems: 'stretch',
	    flex: 1,
	    alignItems: 'center',
	    justifyContent: 'center',
	    backgroundColor: '#fff',
	},
	body: {
	    flex: 9,
	    flexDirection:'row',
	    alignItems:'center',
	    justifyContent:'center',
	    backgroundColor: '#F5FCFF',
	},
	primaryButton: {
	    margin: 10,
	    padding: 15,
	    alignSelf:'center',
	    backgroundColor:"blue",
	    width:150
	},
    });
    **/
