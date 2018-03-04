import React from 'react'
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import firebase from 'firebase'
import { ImagePicker } from 'expo'
import { FontAwesome } from '@expo/vector-icons'
import { primary, white, gray, black } from '../utils/colors'

export default class ProfileEditPage extends React.Component {
	constructor(props) {
		super(props)
	}

	uid = this.props.nav.state.params.uid

	updatedUser: {}

	state = {
		imageUrl: null,
		firstname: null,
		lastname: null,
		handle: null,
		about: null,
		location: null,
		websites: null
	}

	componentDidMount() {
		this.props.nav.setParams({ submitProfileEdit: this.submitProfileEdit })

		var self = this
		const url = 'users/main/' + this.uid
  	var userRef = firebase.database().ref(url)

  	userRef.on('value', function(snapshot) {
  		var snapshot = snapshot.val()
  		self.setState({
	  		imageUrl: snapshot.imageUrl,
	  		firstname: snapshot.firstname,
	  		lastname: snapshot.lastname,
	  		handle: snapshot.handle,
	  		about: snapshot.about ? snapshot.about : '',
	  		location: snapshot.location,
	  		websites: snapshot.websites
	    })
  	})
	}

	updateFirstname = (text) => {
		this.updatedUser.firstname = text
	}

	updateLastname = (text) => {
		this.updatedUser.lastname = text
	}

	updateHandle = (text) => {
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
    	//console.log('base64', result.base64)
    	this.uploadImage(result.base64)
    }
	}

	uploadImage = (base64) => {
		var ref = firebase.storage().ref().child('profilePic')
		ref.putString(base64, 'base64').then(function(snapshot) {
		  console.log('snap', snapshot);
		})
	}

	submitProfileEdit = () => {
		console.log("submit")
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
					<FormInput defaultValue={this.state.firstname} inputStyle={{color: black}} onChangeText={(text) => this.updateFirstname(text)}/>
					{/*<FormValidationMessage>Error message</FormValidationMessage>*/}
					<FormLabel>Last name</FormLabel>
					<FormInput defaultValue={this.state.lastname} inputStyle={{color: black}} onChangeText={(text) => this.updateLastname(text)}/>
				</View>
				<View style={styles.otherContainer}>
					<FormLabel>Handle</FormLabel>
					<FormInput defaultValue={this.state.handle} inputStyle={{color: black}} onChangeText={(text) => this.updateHandle(text)}/>
				</View>
				<View style={styles.otherContainer}>
					<FormLabel>About you</FormLabel>
					<FormInput defaultValue={this.state.about} inputStyle={{color: black}} onChangeText={(text) => this.updateAbout(text)}/>
				</View>
				<View style={styles.otherContainer}>
					<FormLabel>Location</FormLabel>
					<FormInput defaultValue={this.state.location} inputStyle={{color: black}} onChangeText={(text) => this.updateLocation(text)}/>
				</View>
				<View style={styles.otherContainer}>
					<FormLabel>Websites</FormLabel>
					<FormInput defaultValue={this.state.websites} inputStyle={{color: black}} onChangeText={(text) => this.updateWebsites(text)}/>
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
