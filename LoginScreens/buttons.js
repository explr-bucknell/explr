import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import Dimensions from 'Dimensions';
import { primary, white } from '../utils/colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const WIDTH = DEVICE_WIDTH * 0.75;
const HEIGHT = WIDTH / 7;
const RADIUS = HEIGHT / 2;
const MARGIN = HEIGHT / 2.5;
const SKIP = DEVICE_HEIGHT / 4;

export default class Buttons extends Component {

  constructor(props) {
    super(props);

    this.state = {
    	loggedIn: true,
    }
	}

	componentDidMount() {
		var self = this
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
		    // User is signed in.
		    var nav = self.props.nav
		    nav.navigate('MainPage', {uid: user.uid, loginNav: nav})
		  } else {
		    // No user is signed in.
		    self.setState({
					loggedIn: false,
				})
		  }
		})
	}

	render() {
		console.log(this.state.loggedIn);
		return (
			<View style={styles.container}>
				{ this.state.loggedIn || <View>
					<TouchableOpacity {...this.props} style={styles.signup} onPress={() => {this.props.nav.navigate('SignUpName')}}>
			    	<Text style={styles.signupText}>SIGN UP</Text>
			    </TouchableOpacity>
			    <TouchableOpacity {...this.props} style={styles.login} onPress={() => {this.props.nav.navigate('Login')}}>
			    	<Text style={styles.loginText}>LOGIN</Text>
			    </TouchableOpacity> 
		  	</View> }
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 3,
		alignItems: 'center',
		justifyContent: 'center',
	},
	signup: {
		width: WIDTH,
		height: HEIGHT,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: primary,
		borderWidth: 1,
    	borderColor: white,
		borderRadius: RADIUS,
	},
	login: {
		width: WIDTH,
		height: HEIGHT,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: white,
		borderRadius: RADIUS,
		marginTop: MARGIN,
	},
	signupText: {
		color: white,
		fontWeight: 'bold',
	},
	loginText: {
		color: primary,
		fontWeight: 'bold',
	}
});
