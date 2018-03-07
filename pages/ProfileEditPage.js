import React from 'react'
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import firebase from 'firebase'
import { ImagePicker } from 'expo'
import { FontAwesome } from '@expo/vector-icons'
import { uploadNewProfilePic } from '../network/Requests'
import { primary, white, gray, black } from '../utils/colors'

export default class ProfileEditPage extends React.Component {
	constructor(props) {
		super(props)
	}

	uid = this.props.nav.state.params.uid

	updatedUser = {}

	state = {
		imageUrl: null,
		firstname: null,
		lastname: null,
		handle: null,
		about: null,
		location: null,
		websites: null,
		handleStatus: true
	}

	componentDidMount() {
		this.props.nav.setParams({ submitProfileEdit: this.submitProfileEdit })

		var self = this
		const url = 'users/main/' + this.uid
  	var userRef = firebase.database().ref(url)

  	userRef.on('value', function(snapshot) {
  		var snapshot = snapshot.val()
  		self.setState({
	  		firstname: snapshot.firstname,
	  		lastname: snapshot.lastname,
	  		handle: snapshot.handle,
	  		about: snapshot.about ? snapshot.about : '',
	  		location: snapshot.location,
	  		websites: snapshot.websites
	    })
  		if (snapshot.imageUrl) {
  			self.getProfileImg(snapshot.imageUrl)
  		}
  	})
	}

	getProfileImg = (url) => {
		var self = this
		var gsReference = firebase.storage().ref(url)
		gsReference.getDownloadURL().then(function(imageUrl) {
			self.setState({ imageUrl })
		})
	}

	validateHandle = async (handle) => {
		if (handle == this.state.handle) {
			return true
		}
		var allowed = (handle.length >= 5) && (handle.length <= 20) && (/^[a-z0-9]+$/.test(handle))
		var duplicate;

		var handlesRef = firebase.database().ref('users/handles')
		await handlesRef.child(handle).once("value", function(snapshot) {
	  	if (snapshot.val()) {
	  		duplicate = true
	  	} else {
	  		duplicate = false
	  	}
		})
		return (!duplicate) && allowed
	}

	updateFirstname = (text) => {
		this.updatedUser.firstname = text
	}

	updateLastname = (text) => {
		this.updatedUser.lastname = text
	}

	updateHandle = (text) => {
		this.setState({ handleStatus: true })
		this.updatedUser.handle = text
	}

	updateAbout = (text) => {
		this.updatedUser.about = text
	}

	updateLocation = (text) => {
		this.updatedUser.location = text
	}

	updateWebsites = (text) => {
		this.updatedUser.websites = text
	}

	changePicture = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      base64: true
    })

    if (!result.cancelled) {
    	uploadNewProfilePic(result.base64, this.uid)
    }
	}

	submitProfileEdit = async () => {
		if (this.updatedUser.handle) {
			var valid = await this.validateHandle(this.updatedUser.handle)
			if (!valid) {
				this.setState({ handleStatus: false })
				return
			}
			let newHandle = this.updatedUser.handle
			let oldHandle = this.state.handle
			if (newHandle != oldHandle) {
				let uid = this.uid
				handleRef = firebase.database().ref('users/handles')
				handleRef.child(oldHandle).remove()
				handleRef.child(newHandle).set(uid)
			}
		}
		var self = this
		const url = 'users/main/' + this.uid
  	var userRef = firebase.database().ref(url)
  	var updates = this.updatedUser
  	userRef.update({ ...updates }).then(() => {
  		self.props.nav.goBack()
  	})
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<View style={styles.profilePicContainer}>
					<View style={styles.profilePicWrapper}>
						<Image style={styles.profilePic} source={ this.state.imageUrl ? {uri: this.state.imageUrl} : (require('../assets/images/profilePic.png')) } />
					</View>
					<TouchableOpacity style={styles.editPic} onPress={() => {this.changePicture()}}>
						<FontAwesome name='pencil' style={styles.icon}/>
					</TouchableOpacity>
				</View>
				<View style={styles.nameContainer}>
					<FormLabel>First name</FormLabel>
					<FormInput defaultValue={this.state.firstname} inputStyle={{color: black}} maxLength={10} onChangeText={(text) => this.updateFirstname(text)}/>
					<FormLabel>Last name</FormLabel>
					<FormInput defaultValue={this.state.lastname} inputStyle={{color: black}} maxLength={10} onChangeText={(text) => this.updateLastname(text)}/>
				</View>
				<View style={styles.otherContainer}>
					<FormLabel>Handle</FormLabel>
					<FormInput defaultValue={this.state.handle} inputStyle={{color: black}} maxLength={10} autoCapitalize={'none'} onChangeText={(text) => this.updateHandle(text)}/>
					{ !this.state.handleStatus && <FormValidationMessage>This handle is already taken</FormValidationMessage> }
				</View>
				<View style={styles.otherContainer}>
					<FormLabel>About you</FormLabel>
					<FormInput defaultValue={this.state.about} inputStyle={{color: black}} maxLength={50} onChangeText={(text) => this.updateAbout(text)}/>
				</View>
				<View style={styles.otherContainer}>
					<FormLabel>Location</FormLabel>
					<FormInput defaultValue={this.state.location} inputStyle={{color: black}} maxLength={20} onChangeText={(text) => this.updateLocation(text)}/>
				</View>
				<View style={styles.otherContainer}>
					<FormLabel>Websites</FormLabel>
					<FormInput defaultValue={this.state.websites} inputStyle={{color: black}} maxLength={30} onChangeText={(text) => this.updateWebsites(text)}/>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: white,
		flexGrow: 1,
		padding: 20
	},
	profilePicContainer: {
		flex: 3
	},
	nameContainer: {
		flex: 2
	},
	otherContainer: {
		flex: 1
	},
	profilePicWrapper: {
		width: 120,
		height: 120,
		justifyContent: 'center',
  	alignItems: 'center',
		borderRadius: 60,
		borderColor: gray,
		borderWidth: 3,
		margin: 10
	},
	profilePic: {
		flex: 1,
		width: 112,
		height: 112,
		borderRadius: 56,
		borderWidth: 0
	},
	editPic: {
		backgroundColor: gray,
  	position: 'absolute',
  	justifyContent: 'center',
  	alignItems: 'center',
  	left: 100,
  	top: 100,
  	width: 26,
  	height: 26,
  	borderRadius: 13,
  	borderWidth: 0
	},
	icon: {
		fontSize: 15,
		color: white
	}
})
