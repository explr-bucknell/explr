import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import firebase from 'firebase'
import { primary, white, gray, black } from '../utils/colors'

export default class SearchUsers extends React.Component {
	constructor(props) {
		super(props)
	}

	state = {
		uids: [],
		names: [],
		handles: [],
		images: []
	}

	componentDidMount() {
		this.props.nav.setParams({ handleUserSearch: this.handleTextChange });
	}

	handleTextChange = (text) => {
		console.log("Search users", text)
		if (!text) {
			this.setState({ uids:[], names: [], handles: [], images: [] })
			return
		}
		text = text.toLowerCase()
		var self = this
		var ref = firebase.database().ref('users/main')
		ref.orderByChild("handle").startAt(text).endAt(text + '\uf8ff').limitToFirst(10).on("value", function(snapshot) {
			var uids = []
  		var names = []
  		var handles = []
  		var images = []
  		snapshot.forEach(function(user) {
  			var userVal = user.val()
  			uids.push(user.key)
  			names.push(userVal.firstname + " " + userVal.lastname)
  			handles.push(userVal.handle)
  			images.push(userVal.imageUrl)
  		})
	  	self.setState({ uids, names, handles, images })
		})	
	}

	render() {
		return (
			<View style={styles.container}>
				{this.state.names.map((name, i) => (
					<TouchableOpacity key={i} style={styles.profileCard} onPress={() => this.props.nav.navigate('ProfilePage', {uid: this.state.uids[i]})}>
						<Image style={styles.profilePic} source={ this.state.images[i] ? {uri: this.state.images[i]} : (require('../assets/images/profilePic.png')) } />
						<View style={styles.textWrapper}>
							<Text style={styles.name}>{name}</Text>
							<Text style={styles.handle}>{this.state.handles[i]}</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	profileCard: {
		flexDirection: 'row',
		backgroundColor: white
	},
	profilePic: {
		width: 50,
		height: 50,
		margin: 10,
		borderRadius: 25,
		borderColor: gray,
		borderWidth: 1
	},
	textWrapper: {
		margin: 10
	},
	name: {
		marginTop: 5,
		color: black,
		fontSize: 16,
		fontWeight: 'bold'
	},
	handle: {
		marginTop: 2,
		color: gray,
		fontSize: 14,
		fontWeight: 'bold'
	}
})
