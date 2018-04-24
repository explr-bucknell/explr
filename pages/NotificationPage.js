import React from 'react'
import { View, StyleSheet } from 'react-native'
import FollowRequest from '../components/Notifications/FollowRequest'
import FollowApproval from '../components/Notifications/FollowApproval'
import JoinTripRequest from '../components/Notifications/JoinTripRequest'
import JoinTripApproval from '../components/Notifications/JoinTripApproval'
import { getUserNotifications, deleteNotification } from '../network/notifications'
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

  	this.notificationRef = getUserNotifications(uid, this.loadNotifications)
  }

  componentWillUnmount() {
    this.notificationRef.off('value')
  }

  loadNotifications = (data) => {
  	this.setState({ data })
  }

  removeNotification = (notificationId) => {
  	deleteNotification(this.state.uid, notificationId)
  }

	render() {
		var notifications = this.state.data
		var { uid, nav } = this.state
    var notificationKeys = Object.keys(notifications)
    notificationKeys.sort((a,b) => notifications[a].time > notifications[b].time ? -1 : 1)

		return (
			<View style={styles.container}>
				{notificationKeys.map((id, i) => (
					(notifications[id].type === 'FOLLOW_REQUEST' && <FollowRequest 
						key={i} 
						notificationId={id} 
						data={notifications[id].data} 
						uid={uid} 
						nav={nav} 
						complete={this.removeNotification}
					/>) ||
					(notifications[id].type === 'FOLLOW_APPROVAL' && <FollowApproval
						key={i}
						notificationId={id}
						data={notifications[id].data}
						nav={nav}
						complete={this.removeNotification}
					/>) ||
          (notifications[id].type === 'JOIN_TRIP_REQUEST' && <JoinTripRequest
            key={i} 
            notificationId={id} 
            data={notifications[id].data} 
            uid={uid} 
            nav={nav} 
            complete={this.removeNotification}
          />) ||
          (notifications[id].type === 'JOIN_TRIP_APPROVAL' && <JoinTripApproval
            key={i}
            notificationId={id}
            data={notifications[id].data}
            nav={nav}
            complete={this.removeNotification}
          />)
				))}
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
