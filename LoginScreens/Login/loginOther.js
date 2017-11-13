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
		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
			permissions: ['public_profile'],
		});
		if (type === 'success') {
			var credential = firebase.auth.FacebookAuthProvider.credential(token);

			firebase.auth().signInWithCredential(credential).then(function() {
				navigate("MainPage");
			}).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// The email of the user's account used.
				var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				var credential = error.credential;
				// ...
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

	async googleSignin() {
		var navigate = this.props.nav.navigate;
		try {
		    const result = await Expo.Google.logInAsync({
				androidClientId: GOOGLE_ANDROID_ID,
				iosClientId: GOOGLE_IOS_ID,
				scopes: ['profile', 'email'],
		    });

		    if (result.type === 'success') {
		    	console.log(result);
		    	var credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);

		    	firebase.auth().signInWithCredential(credential).then(function() {
					navigate("MainPage");
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
					//navigate("Login");
				});
		    } else {
		    	//navigate("Login");
		    }
		} catch(e) {
			//navigate("Login");
		}
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
