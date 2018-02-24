import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
import { FontAwesome } from '@expo/vector-icons';
import { StackNavigator } from 'react-navigation';
import firebase from 'firebase';
import { primary, white } from '../../utils/colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const MARGIN_LEFT = DEVICE_WIDTH * 0.1;
const MARGIN_RIGHT = MARGIN_LEFT;

const SKIP = DEVICE_HEIGHT / 10;

// button
const WIDTH = DEVICE_WIDTH * 0.75;
const HEIGHT = WIDTH / 7;
const RADIUS = HEIGHT / 2;

export default class SignupDone extends Component {
	constructor(props) {
		super(props);
  	this.state = {
  		disabled: false,
  	};
	}

	signedUp() {
		var navigate = this.props.nav.navigate;
		var user = firebase.auth().currentUser;

		if (user) {
			// User is signed in.
			var uid = user.uid;
			navigate("MainPage", {uid: uid});
		} else {
			// No user is signed in.
			navigate("Start");
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.titleWrapper}>
					<Text style={styles.title}>Congrats!</Text>
				</View>
				<Text style={styles.text}>Your account is ready to use</Text>
				<FontAwesome name="check" style={styles.icon}/>
				<View style={styles.buttonWrapper}>
					<TouchableOpacity disabled={this.state.disabled} onPress={() => this.signedUp()} style={styles.button}>
						<Text style={styles.buttonText}>Start your journey!</Text>
			    </TouchableOpacity>
		    </View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: SKIP,
		marginLeft: MARGIN_LEFT,
		marginRight: MARGIN_RIGHT,
		marginBottom: MARGIN_LEFT,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleWrapper: {
		flex: 2,
		justifyContent: 'flex-end',
	},
	title: {
		fontSize: 30,
		color: white,
		fontWeight: '500',
		marginBottom: 10,
	},
	text: {
		flex: 1,
		fontSize: 15,
		color: white,
		fontWeight: '400',
		textAlign: 'center',
		justifyContent: 'center',
	},
	icon: {
		flex: 4,
		fontSize: 100,
		color: white,
		fontWeight: '100',
	},
	buttonWrapper: {
		flex: 3,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: white,
		width: WIDTH,
		height: HEIGHT,
		borderRadius: RADIUS,
	},
	buttonText: {
		color: primary,
		fontWeight: 'bold',
	},
});
