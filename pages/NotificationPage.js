import React from 'react'
import { View, StyleSheet } from 'react-native'
import firebase from 'firebase'
import FollowRequest from '../components/Notifications/FollowRequest'
import FollowApproval from '../components/Notifications/FollowApproval'
import { white } from '../utils/colors'

export default class NotificationPage extends React.Component {
	constructor(props) {
    super(props);
  }

  state = {
  	uid: null,
  	nav: null,
  	data: []
  }

  componentWillMount() {
  	var { uid, navigate } = this.props

  	this.setState({
  		uid: uid,
  		nav: navigate
  	})

  	this.loadNotifications(uid, navigate)
  }

  loadNotifications = (uid, nav) => {
  	var ref = firebase.database().ref('users/notifications/' + uid)
  	var self = this
  	ref.on('value', function(snapshot) {
  		self.setState({
				data: snapshot.val() ? snapshot.val() : []
			})
  	})
  }

  removeNotification = (notificationId) => {
  	var ref = firebase.database().ref('users/notifications/' + this.state.uid + '/' + notificationId)
  	ref.remove()
  	var data = Object.assign({}, this.state.data)
  	delete data[notificationId]
  	this.setState({ data })
  }

	render() {
		var notifications = this.state.data
		var { uid, nav } = this.state
		return (
			<View style={styles.container}>
				{Object.keys(notifications).map((id, i) => (
					(notifications[id].type == 'FOLLOW_REQUEST' && <FollowRequest 
						key={i} 
						notificationId={id} 
						data={notifications[id].data} 
						uid={uid} 
						nav={nav} 
						complete={this.removeNotification}
					/>) ||
					(notifications[id].type == 'FOLLOW_APPROVAL' && <FollowApproval
						key={i}
						data={notifications[id].data}
					/>)
				))}
				{ /*followRequest({ name: "Jingya Wu", handle: "jw057" }, this.state.nav)*/ }
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: white,
		flex: 1
	}
})
