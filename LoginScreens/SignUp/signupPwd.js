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

const SKIP = DEVICE_HEIGHT / 15;
const INPUT_HEIGHT = DEVICE_HEIGHT * 0.05;

// Round button
const WIDTH = DEVICE_WIDTH / 8;
const HEIGHT = WIDTH;
const RADIUS = WIDTH / 2;

export default class SignupPwd extends Component {
	constructor(props) {
		super(props);
  	this.state = {
  		allowed: false,
  		verified: true,
  		firstName: this.props.nav.state.params.firstName,
  		lastName: this.props.nav.state.params.lastName,
  		email: this.props.nav.state.params.email,
  		pwd: "",
  		pwdVerify: ""
  	};
	}

	checkPwd(pwd) {
		format = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%?!*+"'*+,-./:;<=>^_~`]){8,20}/;
		allowed = /^[a-zA-Z0-9@#$%?!]+$/;
		pwdVerify = this.state.pwdVerify;
		this.setState({
			allowed: ((format.test(pwd) && allowed.test(pwd)) ? true : false),
			verified: pwd == pwdVerify,
			pwd: pwd,
		});
	}

	checkPwdVerify(pwdVerify) {
		pwd = this.state.pwd;
		this.setState({
			verified: pwd == pwdVerify,
			pwdVerify: pwdVerify,
		});
	}

	getUserData() {
		return {firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, pwd: this.state.pwd};
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
						<Item stackedLabel style={styles.item}>
							<Label style={styles.label}>VERIFY PASSWORD</Label>
							<Input onChangeText={(text) => this.checkPwdVerify(text)} secureTextEntry={true} autoCapitalize='none' autoCorrect={false} keyboardAppearance={'light'} style={styles.input}/>
						</Item>
						<Text style={[styles.alert, {display: this.state.verified ? 'none' : 'flex'}]}>ENTRY DOES NOT MATCH!</Text>
					</Form>
					<TouchableOpacity disabled={!(this.state.allowed && this.state.verified)} style={(this.state.allowed && this.state.verified) ? styles.button : [styles.button, styles.disabled]} onPress={() => {this.props.nav.navigate('SignUpHandle', this.getUserData())}}>
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
	alert: {
		color: 'red',
		fontSize: 12,
		marginTop: DEVICE_HEIGHT * 0.01,
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
