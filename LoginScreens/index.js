import React, { Component } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Text } from 'react-native';
import Dimensions from 'Dimensions';
import { StackNavigator, headerMode, navigationOptions } from 'react-navigation';
import Logo from './logo';
import Buttons from './buttons';
import LoginLogo from './Login/loginLogo';
import LoginForm from './Login/loginForm';
import LoginForget from './Login/loginForget';
import LoginSubmit from './Login/loginSubmit';
import LoginOther from './Login/loginOther';
import SignupName from './SignUp/signupName';
import SignupEmail from './SignUp/signupEmail';
import SignupPwd from './SignUp/signupPwd';
import SignupConfirm from './SignUp/signupConfirm';
import SignupDone from './SignUp/signupDone';
import { primary, white } from '../utils/colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const MARGIN_LEFT = DEVICE_WIDTH * 0.1;
const MARGIN_RIGHT = MARGIN_LEFT;
const TEXT_SKIP = DEVICE_HEIGHT / 10;

const StartScreen = ( {navigation} ) => (
	<View style={styles.container}>
        <Logo />
        <Buttons nav={navigation}/>
    </View>
);

const PromptName = ( {navigation} ) => (
	<View style={styles.container}>
		<Text style={styles.text}>What's you name?</Text>
		<SignupName nav={navigation}/>
	</View>
);

const PromptEmail = ( {navigation} ) => (
	<View style={styles.container}>
		<Text style={styles.text}>And, your email?</Text>
		<SignupEmail nav={navigation}/>
	</View>
);

const PromptPwd = ( {navigation} ) => (
	<View style={styles.container}>
		<Text style={styles.text}>Create a password</Text>
		<Text style={[styles.text, styles.secondaryText]}>Your password must include at least one symbol and be 8 or more characters long.</Text>
		<SignupPwd nav={navigation}/>
	</View>
);

const EmailConfirmation = ( {navigation} ) => (
	<View style={styles.container}>
		<SignupConfirm nav={navigation}/>
	</View>
);

const SignUpComplete = ( {navigation} ) => (
	<View style={styles.container}>
		<SignupDone />
	</View>
);

const LoginScreen = ( {navigation} ) => (
	<View style={{flex: 1, backgroundColor: white}}>
		<LoginLogo />
		<LoginForm />
		<LoginForget nav={navigation}/>
		<LoginSubmit />
		<LoginOther />
	</View>
);

const SignUpNavOpts = {
	headerTitle: "Creat Account",
	headerStyle: { 
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerBackTitle: null,
}

const LoginNavigator = StackNavigator({
  	Start: {
    	screen: StartScreen,
    	navigationOptions: {
      		headerStyle: { 
				backgroundColor: primary,
				borderBottomWidth: 0,
			},
    	},
  	},
  	SignUpName: {
    	screen: PromptName,
    	navigationOptions: SignUpNavOpts,
	},
	SignUpEmail: {
		screen: PromptEmail,
		navigationOptions: SignUpNavOpts,
	},
	SignUpPwd: {
		screen: PromptPwd,
		navigationOptions: SignUpNavOpts,
	},
	SignUpConfirm: {
		screen: EmailConfirmation,
		navigationOptions: SignUpNavOpts,
	},
	SignUpDone: {
		screen: SignUpComplete,
		navigationOptions: SignUpNavOpts,
	},
  	Login: {
  		screen: LoginScreen,
  		navigationOptions: {
      		headerStyle: { 
				backgroundColor: white,
				borderBottomWidth: 0,
			},
			headerTintColor: primary,
    	},
  	}
}, );

export default LoginNavigator;

const styles = StyleSheet.create({
	container: {
		flex: 1, 
		backgroundColor: primary,
	},
	text: {
		color: white,
		fontSize: 25,
		marginLeft: MARGIN_LEFT,
		marginRight: MARGIN_RIGHT,
		marginTop: TEXT_SKIP,
	},
	secondaryText: {
		fontSize: 14,
		marginTop: TEXT_SKIP / 3,
		fontWeight: '600',
	},
});