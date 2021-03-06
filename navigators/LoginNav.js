import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Dimensions from 'Dimensions'
import { StackNavigator, navigationOptions } from 'react-navigation'
import Logo from '../LoginScreens/logo'
import Buttons from '../LoginScreens/buttons'
import LoginLogo from '../LoginScreens/Login/loginLogo'
import LoginForm from '../LoginScreens/Login/loginForm'
import LoginOther from '../LoginScreens/Login/loginOther'
import SignupName from '../LoginScreens/SignUp/signupName'
import SignupHandle from '../LoginScreens/SignUp/signupHandle'
import SignupEmail from '../LoginScreens/SignUp/signupEmail'
import SignupPwd from '../LoginScreens/SignUp/signupPwd'
import SignupConfirm from '../LoginScreens/SignUp/signupConfirm'
import SignupDone from '../LoginScreens/SignUp/signupDone'
import ForgotPwd from '../LoginScreens/Login/ForgotPwd'
import ResetPwd from '../LoginScreens/Login/ResetPwd'
import MainNavigator from './MainNav'
import { primary, white } from '../utils/colors'

const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = Dimensions.get('window').height

const MARGIN_LEFT = DEVICE_WIDTH * 0.1
const MARGIN_RIGHT = MARGIN_LEFT
const TEXT_SKIP = DEVICE_HEIGHT / 10

const StartScreen = ( {navigation} ) => (
	<View style={styles.container}>
    <Logo />
    <Buttons nav={navigation}/>
  </View>
)

const PromptName = ( {navigation} ) => (
	<View style={styles.container}>
		<Text style={styles.text}>What's your name?</Text>
		<SignupName nav={navigation}/>
	</View>
)

const PromptEmail = ( {navigation} ) => (
	<View style={styles.container}>
		<Text style={styles.text}>And, your email?</Text>
		<SignupEmail nav={navigation}/>
	</View>
)

const PromptPwd = ( {navigation} ) => (
	<View style={styles.container}>
		<Text style={styles.text}>Create a password</Text>
		<Text style={[styles.text, styles.secondaryText]}>Your password must include at least one symbol and be 8 or more characters long.</Text>
		<SignupPwd nav={navigation}/>
	</View>
)

const PromptHandle = ( {navigation} ) => (
	<View style={styles.container}>
		<Text style={styles.text}>Create an account handle</Text>
		<Text style={[styles.text, styles.secondaryText]}>Your handle must be unique and must only contain lowercase letters and digits.</Text>
		<SignupHandle nav={navigation}/>
	</View>
)

const EmailConfirmation = ( {navigation} ) => (
	<View style={styles.container}>
		<SignupConfirm nav={navigation}/>
	</View>
)

const SignUpComplete = ( {navigation} ) => (
	<View style={styles.container}>
		<SignupDone nav={navigation}/>
	</View>
)

const LoginScreen = ( {navigation} ) => (
	<View style={{flex: 1, backgroundColor: white}}>
		<LoginLogo />
		<LoginForm nav={navigation}/>
		<LoginOther nav={navigation}/>
	</View>
)

const ForgotScreen = ( {navigation} ) => (
	<View style={styles.container}>
		<Text style={styles.text}>What's your email?</Text>
		<ForgotPwd nav={navigation}/>
	</View>
)

const ResetScreen = ( {navigation} ) => (
	<View style={styles.container}>
		<Text style={styles.text}>Create a new password:</Text>
		<ResetPwd nav={navigation}/>
	</View>
)

const MainPage = ( {navigation} ) => (
	<MainNavigator nav={navigation} screenProps={navigation.state.params}/>
)

const SignUpNavOpts = {
	headerTitle: 'Create Account',
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerBackTitle: null,
	gesturesEnabled: false,
}

const LoginNavigator = StackNavigator({
	Start: {
  	screen: StartScreen,
  	navigationOptions: {
    		header: null,
    		gesturesEnabled: false,
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
	SignUpHandle: {
		screen: PromptHandle,
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
			gesturesEnabled: false,
  	},
	},
	ForgotPwd: {
		screen: ForgotScreen,
		navigationOptions: {
			headerTitle: 'Forgot Password',
			headerStyle: {
				backgroundColor: primary,
				borderBottomWidth: 0,
			},
			headerTintColor: white,
			headerBackTitle: null,
			gesturesEnabled: false,
		}
	},
	ResetPwd: {
		screen: ResetScreen,
		navigationOptions: {
			headerTitle: 'Reset Password',
			headerStyle: {
				backgroundColor: primary,
				borderBottomWidth: 0,
			},
			headerTintColor: white,
			headerBackTitle: null,
			gesturesEnabled: false,
		}
	},
	MainPage: {
		screen: MainPage,
		navigationOptions: {
    	header: null,
    	gesturesEnabled: false,
  	},
	}
}, )

export default LoginNavigator

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
})
