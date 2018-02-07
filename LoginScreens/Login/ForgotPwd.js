import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
import { FontAwesome } from '@expo/vector-icons';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import { StackNavigator } from 'react-navigation';
import firebase from 'firebase';
import { primary, white, transparentWhite } from '../../utils/colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const MARGIN_LEFT = DEVICE_WIDTH * 0.1;
const MARGIN_RIGHT = MARGIN_LEFT;

const SKIP = DEVICE_HEIGHT / 10;
const INPUT_HEIGHT = DEVICE_HEIGHT * 0.05;

// Round button
const WIDTH = DEVICE_WIDTH / 8;
const HEIGHT = WIDTH;
const RADIUS = WIDTH / 2;

export default class ForgotPwd extends Component {
	constructor(props) {
		super(props);
    	this.state = {
    		disabled: true,
    		exsit: true,
    		email: "",
    	};
	}

	checkEmail(email) {
		format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		var disabled = !(format.test(email));
		this.setState({ disabled, email });
	}

	async checkExist() {
		var exist = false;
		await firebase.auth().fetchProvidersForEmail(this.state.email).then(function(ids) {
			exist = (ids.length > 0);
		}).catch(function(error) {
			if (error.code == 'auth/quota-exceeded') {
				// not checking
				console.log(error.code);
			}
		});
		this.setState({ exist });
		console.log(exist);
		if (exist) {
			console.log("Sending");
			//this.props.nav.navigate('ResetPwd', this.getUserData());
			this.sendEmail();
		}
	}

	sendEmail() {
		var auth = firebase.auth();
		//var user = auth.currentUser;
		var email = this.state.email;
		var navigate = this.props.nav.navigate;

		/*
		user.updateProfile({
			emailVerified: false,
		}).then(function() {
			user.sendEmailVerification().then(function() {
			  	// Email sent.
			  	navigate('SignUpConfirm', {email: email, mode:'reset'});
			}).catch(function(error) {
			  	// An error happened.
			  	navigate('SignUpConfirm', {email: error.message, mode:'reset'});
			});
		}, function(error) {
			// An error happened.
		});
		*/
		
		auth.sendPasswordResetEmail(email).then(function() {
		 	// Email sent.
		 	console.log('Reset password email sent');
		 	navigate('Login');
		}).catch(function(error) {
			// An error happened.
		  	console.log("Reset password email sending failed.");
		});
	}

	render() {
		return (
			<Container style={styles.container}>
				<Content keyboardShouldPersistTaps='always'>
					<Form>
						<Item stackedLabel style={styles.item}>
							<Label style={styles.label}>EMAIL ADDRESS</Label>
							<Input onChangeText={(text) => this.checkEmail(text)} autoCapitalize='none' autoCorrect={false} keyboardType={'email-address'} keyboardAppearance={'light'} style={styles.input}/>
						</Item>
						<Text style={[styles.duplicate, {display: this.state.exist ? 'none' : 'flex'}]}>THIS EMAIL IS NOT REGISTERED!</Text>
					</Form>
					<TouchableOpacity disabled={this.state.disabled} style={this.state.disabled ? [styles.button, styles.disabled] : styles.button} onPress={() => {this.checkExist()}}>
				    	<FontAwesome name="angle-right" style={styles.next}/>
				    </TouchableOpacity>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: SKIP,
		marginLeft: MARGIN_LEFT,
		marginRight: MARGIN_RIGHT,
		justifyContent:'center',
	},
	label: {
		color: white,
		fontSize: 12,
		fontWeight: "700",
		marginBottom: DEVICE_HEIGHT * 0.01,
	},
	duplicate: {
		color: 'red',
		fontSize: 12,
		marginTop: DEVICE_HEIGHT * 0.01,
	},
	input: {
		height: INPUT_HEIGHT,
		color: white,
	},
	item: {
		marginBottom: INPUT_HEIGHT/3,
		paddingLeft: 0,
		marginLeft: 0,
		paddingBottom: 0,
	},
	button: {
		width: WIDTH,
		height: HEIGHT,
		borderRadius: RADIUS,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: SKIP / 3,
		marginLeft: WIDTH * 6 - MARGIN_RIGHT,
		backgroundColor: white,
	},
	next: {
		color: primary,
		fontSize: 35,
	},
	disabled: {
		backgroundColor: transparentWhite,
	},
});
