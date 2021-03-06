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

export default class ResetPwd extends Component {
	constructor(props) {
		super(props);
  	this.state = {
  		disabled: true,
  		//alert: false,
  		email: this.props.nav.state.params.email,
  		pwd: "",
  	};
	}

	checkPwd(pwd) {
		format = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%?!]){8,20}/;
		allowed = /^[a-zA-Z0-9@#$%?!]+$/;
		this.setState({
			disabled: ((format.test(pwd) && allowed.test(pwd)) ? false : true),
			pwd: pwd,
		});
	}

	getUserData() {
		return {email: this.state.email, pwd: this.state.pwd};
	}

	async createAccount() {
		var navigate = this.props.nav.navigate;
		var email = this.state.email;
		var displayName = this.state.firstName + " " + this.state.lastName;

		firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pwd).then(function() {

			var user = firebase.auth().currentUser;

			user.updateProfile({
				displayName: displayName,
			}).then(function() {
				user.sendEmailVerification().then(function() {
				  	// Email sent.
				  	navigate('SignUpConfirm', {email: email});
				}).catch(function(error) {
				  	// An error happened.
				  	navigate('SignUpConfirm', {email: error.message});
				});
			}, function(error) {
				// An error happened.
			});

		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
		});
	}

	render() {
		return (
			<Container style={styles.container}>
				<Content keyboardShouldPersistTaps='always'>
					<Form>
						<Item stackedLabel style={styles.item}>
							<Label style={styles.label}>PASSWORD</Label>
							<Input onChangeText={(text) => this.checkPwd(text)} secureTextEntry={true} autoCapitalize='none' autoCorrect={false} keyboardAppearance={'light'} style={styles.input}/>
						</Item>
					</Form>
					<TouchableOpacity disabled={this.state.disabled} style={this.state.disabled ? [styles.button, styles.disabled] : styles.button} onPress={() => {this.props.nav.navigate('SignUpHandle', this.getUserData())}}>
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
