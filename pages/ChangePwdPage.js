import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Card, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import firebase from 'firebase'
import { ImagePicker } from 'expo'
import { FontAwesome } from '@expo/vector-icons'
import { uploadNewProfilePic } from '../network/Requests'
import { primary, white, gray, black } from '../utils/colors'

export default class ChangePwdPage extends React.Component {
	constructor(props) {
		super(props)
	}

	uid = this.props.nav.state.params.uid

	currPwd = ''
	newPwd = ''
	newPwdVerify = ''

	state = {
		correct: true,
		allowed: true,
		verified: true
	}

	componentDidMount() {
		this.props.nav.setParams({ changePassword: this.changePassword })
	}

	updateCurrPwd = (currPwd) => {
		this.currPwd = currPwd
		this.setState({
			correct: true
		})
	}

	checkPwd = (pwd) => {
		let format = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%?!*+"'*+,-./:;<=>^_~`]){8,20}/
		let allowed = /^[a-zA-Z0-9@#$%?!]+$/
		this.newPwd = pwd
		this.setState({
			allowed: ((format.test(pwd) && allowed.test(pwd)) ? true : false),
			verified: pwd == this.pwdVerify
		})
	}

	checkPwdVerify = (pwdVerify) => {
		this.newPwdVerify = pwdVerify
		this.setState({
			verified: this.newPwd == pwdVerify
		})
	}

	changePassword = () => {
		if (this.newPwd == '') {
			this.setState({
				allowed: false
			})
			return
		}
		let { allowed, verified } = this.state
		if (!allowed || !verified) {
			return
		}
		var self = this
		let currPwd = this.currPwd
		let newPwd = this.newPwd
		let email = firebase.auth().currentUser.email
    let credential = firebase.auth.EmailAuthProvider.credential(email, currPwd)
    let user = firebase.auth().currentUser
    user.reauthenticateWithCredential(credential).then(function() {
      // User re-authenticated.
      user.updatePassword(newPwd).then(function() {
			  // Update successful.
			  console.log('password changed')
			  self.props.nav.goBack()
			}).catch(function(error) {
			  // An error happened.
			  console.log('change pwd failed', error)
			})
    }).catch(function(error) {
      // An error happened.
      self.setState({
      	corrent: false
      })
      console.log('reauthenticate error', error)
    })
  }

	render() {
		return (
			<View style={styles.container}>
				<FormLabel labelStyle={styles.label}>CURRENT PASSWORD</FormLabel>
				<FormInput inputStyle={{color: black}} onChangeText={(text) => this.updateCurrPwd(text)} secureTextEntry={true} autoCapitalize='none' autoCorrect={false}/>
				{ !this.state.correct && <FormValidationMessage>Password is not correct</FormValidationMessage> }
				<FormLabel labelStyle={styles.label}>NEW PASSWORD</FormLabel>
				<FormInput inputStyle={{color: black}} onChangeText={(text) => this.checkPwd(text)} secureTextEntry={true} autoCapitalize='none' autoCorrect={false}/>
				{ !this.state.allowed && <FormValidationMessage>Password must contain digit, lowercase, uppercase, and special character</FormValidationMessage> }
				<FormLabel labelStyle={styles.label}>CONFIRM NEW PASSWORD</FormLabel>
				<FormInput inputStyle={{color: black}} onChangeText={(text) => this.checkPwdVerify(text)} secureTextEntry={true} autoCapitalize='none' autoCorrect={false}/>
				{ !this.state.verified && <FormValidationMessage>Entries does not match</FormValidationMessage> }
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: white,
		flex: 1
	},
	label: {
		fontSize: 12
	}
})
