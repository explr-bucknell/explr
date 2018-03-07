import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
import { FontAwesome } from '@expo/vector-icons';
import firebase from 'firebase';
import Expo from 'expo';
import { primary, white, gray, facebook, twitter, google } from '../../utils/colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const MARGIN = DEVICE_WIDTH * 0.125;
const WIDTH = DEVICE_WIDTH / 6;
const HEIGHT = WIDTH;
const RADIUS = HEIGHT / 2;

const FACEBOOK_APP_ID = '146782192607402';
const GOOGLE_IOS_ID = '866651490806-ni2d9pkmtulqml7hu0bue0fc3h8p11uq.apps.googleusercontent.com';
const GOOGLE_ANDROID_ID = '866651490806-epbh45hn0peiaapgllrmv5o3l0v2jpoi.apps.googleusercontent.com';

export default class LoginOther extends Component {

	async facebookSignin() {
		var navigate = this.props.nav.navigate;
		var self = this;
		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
			permissions: ['email', 'public_profile'],
		});
		if (type === 'success') {
			var credential = firebase.auth.FacebookAuthProvider.credential(token);

			firebase.auth().signInWithCredential(credential).then(function() {
				var user = firebase.auth().currentUser;
				var uid = user.uid;
				self.fbFetch(uid, token);
			}).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// The email of the user's account used.
				var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				var credential = error.credential;
				// ...
				console.log(error.message)
				navigate("Login");
			});
			/*
			// Get the user's name using Facebook's Graph API
			const response = await fetch(
		  		`https://graph.facebook.com/me?access_token=${token}`);
			Alert.alert(
		  		'Logged in!',
		  		`Hi ${(await response.json()).name}!`,
			);
			*/
		}
	}

	async fbFetch(uid, token) {
		var fields = 'first_name,last_name,picture';
		const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=${fields}`);
		var data = await response.json();
		
		this.initUser(uid, data.first_name, data.last_name, data.picture.data.url);
	}

	async googleSignin() {
		var navigate = this.props.nav.navigate;
		var self = this;
		try {
	    const result = await Expo.Google.logInAsync({
			androidClientId: GOOGLE_ANDROID_ID,
			iosClientId: GOOGLE_IOS_ID,
			scopes: ['profile', 'email'],
	    });

	    if (result.type === 'success') {
	    	//console.log(result);
	    	var credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);

	    	firebase.auth().signInWithCredential(credential).then(function() {
				var uid = firebase.auth().currentUser.uid;
				console.log(result.user);
				self.initUser(uid, result.user.givenName, result.user.familyName, result.user.photoUrl);
				
			}).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// The email of the user's account used.
				var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				var credential = error.credential;
				// ...
				console.log(errorMessage);
				navigate("Login");
			});
	    } else {
	    	//navigate("Login");
	    }
		} catch(e) {
			//navigate("Login");
		}
	}

	async initUser(uid, firstname, lastname, imageUrl) {
		var nav = this.props.nav;
		var userExist;
		var usersRef = firebase.database().ref('users/main');
		var user = firebase.auth().currentUser;
		await usersRef.child(uid).once("value", function(snapshot) {
	  	if (snapshot.val()) {
	  		userExist = true;
	  	} else {
	  		userExist = false;
	  	}
		});

		if (!userExist) {
			var name = firstname.replace(/[^a-z]/gi, '').toLowerCase();
			var handle = name;
			var count = 0;
			var found = false;
			while (!found) {
				count += 1;
				var handlesRef = firebase.database().ref('users/handles');
				await handlesRef.child(handle).once("value", function(snapshot) {
			  	if (snapshot.val()) {
			  		handle = name + count.toString();
			  	} else {
			  		found = true;
			  	}
				});
			}

			console.log(handle);

			await firebase.database().ref('users/handles/' + handle).set(uid);

			await firebase.database().ref('users/main/' + uid).set({
		    firstname: firstname,
		    lastname: lastname,
		    handle: handle,
		    numFollowers: 0,
		    numFollowing: 0,
		    imageUrl: imageUrl
			});
		}

		nav.navigate("MainPage", {uid: uid, loginNav: nav});
	}

 	render() {
    	return (
    		<View style={styles.container}>
    			<View style={styles.divider}>
    				<View style={styles.line}/>
    				<Text style={styles.text}>  OR CONNECT WITH  </Text>
    				<View style={styles.line}/>
    			</View>
    			<View style={styles.buttonWrap}>
    				<TouchableOpacity style={[styles.button, styles.facebook]} onPress={() => this.facebookSignin()}>
				    	<FontAwesome name="facebook" style={styles.logo}/>
				    </TouchableOpacity>
				    <TouchableOpacity style={[styles.button, styles.twitter]} onPress={() => null}>
				    	<FontAwesome name="twitter" style={styles.logo}/>
				    </TouchableOpacity>
				    <TouchableOpacity style={[styles.button, styles.google]} onPress={() => this.googleSignin()}>
				    	<FontAwesome name="google" style={styles.logo}/>
				    </TouchableOpacity>
    			</View>
			</View>
    	);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 3.5,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: MARGIN,
		marginRight: MARGIN,
		marginTop: 20,
	},
	divider: {
		flexDirection: 'row',
		flex: 1,
	},
	line: {
		flex: 1,
		borderTopColor: gray,
		borderTopWidth: 1,
		height: 1,
		marginTop: 6,
	},
	text: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 12,
		color: gray,
		fontSize: 10,
		fontWeight: "600",
	},
	buttonWrap: {
		flexDirection: 'row',
		flex: 3,
	},
	button: {
		width: WIDTH,
		height: HEIGHT,
		borderRadius: RADIUS,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: WIDTH / 4,
		marginRight: WIDTH / 4,
	},
	facebook: {
		backgroundColor: facebook,
	},
	twitter: {
		backgroundColor: twitter,
	},
	google: {
		backgroundColor: google,
	},
	logo: {
		color: white,
		fontSize: 25,
	}
});
