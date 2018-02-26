import React from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import firebase from 'firebase'
import { Ionicons } from '@expo/vector-icons'
import { primary, white, gray, black } from '../../utils/colors'

export default class FollowRequest extends React.Component {
	constructor(props) {
		// props.uid
		// props.nav
		// props.notificationId
		// props.data
		// props.complete
		super(props)
	}

	state = {
		sender: {},
		numFollowers: null
	}

	componentWillMount() {
		var senderId = this.props.data.sender
		var senderRef = firebase.database().ref("users/main/" + senderId)
		var self = this
		senderRef.once("value", function(snapshot) {
			var data = snapshot.val()
			var sender = {}
			sender.uid = snapshot.key
			sender.name = data.firstname + " " + data.lastname
			sender.handle = data.handle
			sender.imgUrl = data.imgUrl
			sender.numFollowing = data.numFollowing
			self.setState({ sender })
		})

		var userRef = firebase.database().ref("users/main/" + this.props.uid)
		userRef.on("value", function(snapshot) {
			self.setState({ 
				numFollowers: snapshot.val().numFollowers
			})
		})
	}

	approveRequest = () => {
		var self = this
		var sender = this.state.sender
		var timestamp = (new Date).getTime()
		var ref = firebase.database().ref("users/main/" + this.props.uid)
		var followerRef = firebase.database().ref("users/main/" + sender.uid)
		var updates = {}
		updates["/numFollowers"] = this.state.numFollowers + 1
		updates["followers/" + sender.uid] = timestamp
		var followerUpdates = {}
		followerUpdates["/numFollowing"] = sender.numFollowing + 1
		followerUpdates["/following/" + this.props.uid] = timestamp
		ref.update(updates).then(function() {
			followerRef.update(followerUpdates).then(function() {
				self.sendApprovalNotification()
				self.props.complete(self.props.notificationId)
			})
		})
	}

	denyRequest = () => {
		this.props.complete(this.props.notificationId)
	}

	sendApprovalNotification = () => {
		var uid = this.state.sender.uid
  	var ref = firebase.database().ref('users/notifications/')
  	var newKey = ref.child(uid).push().key
  	var newApproval = {}
  	newApproval[newKey + '/data/approver'] = this.props.uid
  	newApproval[newKey + '/time'] = (new Date).getTime()
  	newApproval[newKey + '/type'] = 'FOLLOW_APPROVAL'
  	ref.child(uid).update(newApproval).then(function() {
  		console.log("follow approval sent")
  	})
	}

	render() {
		var sender = this.state.sender
		return (
			<TouchableOpacity style={styles.container}>
				<TouchableOpacity onPress={() => this.props.nav('ProfilePage', {uid: this.state.sender.uid})} style={styles.imgWrapper}>
					<Image style={styles.profilePic} source={ sender.imageUrl ? {uri: sender.imageUrl} : (require('../../assets/images/profilePic.png')) } />
				</TouchableOpacity>
				<Text style={styles.textWrapper}>
					<Text style={styles.name}>{ sender.name }</Text>
					<Text style={styles.handle}>{ ' (@' + sender.handle + ') ' }</Text>
					<Text style={styles.message}>has requested to follow you.</Text>
				</Text>
				<View style={styles.buttonWrapper}>
					<TouchableOpacity style={styles.approve} onPress={() => this.approveRequest()}>
						<Ionicons name='ios-checkmark' style={styles.approveIcon}/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.deny} onPress={() => this.denyRequest()}>
						<Ionicons name='ios-close' style={styles.denyIcon}/>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: white,
		justifyContent: 'center',
		alignItems: 'center'
	},
	imgWrapper: {
		flex: 1
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
		flex: 3,
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
	},
	message: {
		color: black,
		fontSize: 14
	},
	buttonWrapper: {
		flex: 2,
		flexDirection: 'row'
	},
	approve: {
		flex: 1,
		height: 30,
		margin: 5,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: white
	},
	deny: {
		flex: 1,
		height: 30,
		margin: 5,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: white
	},
	approveIcon: {
		color: primary,
		fontSize: 50
	},
	denyIcon: {
		color: gray,
		fontSize: 50
	}
})
