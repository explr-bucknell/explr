import React from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import firebase from 'firebase'
import { Ionicons } from '@expo/vector-icons'
import { primary, white, gray, black } from '../../utils/colors'

export default class JoinTripApproval extends React.Component {
  constructor(props) {
    // props.nav
    // props.notificationId
    // props.data
    // props.complete
    super(props)
  }

  state = {
    approver: {},
    trip: {}
  }

  componentWillMount() {
    var approverId = this.props.data.approver
    var tripId = this.props.data.tripId
    var approverRef = firebase.database().ref("users/main/" + approverId)
    var tripRef = firebase.database().ref("trips/" + tripId)
    var self = this
    approverRef.once("value", function(snapshot) {
      var data = snapshot.val()
      var approver = {}
      approver.uid = snapshot.key
      approver.name = data.firstname + " " + data.lastname
      approver.handle = data.handle
      if (data.imageUrl) {
        var gsReference = firebase.storage().ref(data.imageUrl)
        gsReference.getDownloadURL().then(function(imageUrl) {
          approver.imageUrl = imageUrl
          self.setState({ approver })
        })
      } else {
        self.setState({ approver })
      }
    })
    tripRef.once("value", function(snapshot) {
      var data = snapshot.val()
      var trip = {}
      trip.id = tripId
      trip.name = data.name
      self.setState({ trip })
    })
  }

  render() {
    const { approver, trip } = this.state
    return (
      <TouchableOpacity style={styles.container}>
        <TouchableOpacity onPress={() => this.props.nav('ProfilePage', {uid: this.state.approver.uid})} style={styles.imgWrapper}>
          <Image style={styles.profilePic} source={ approver.imageUrl ? {uri: approver.imageUrl} : (require('../../assets/images/profilePic.png')) } />
        </TouchableOpacity>
        <Text style={styles.textWrapper}>
          <Text style={styles.name}>{ approver.name }</Text>
          <Text style={styles.handle}>{ " (@" + approver.handle + ") " }</Text>
          <Text style={styles.message}>has approved you to join</Text>
          <Text style={styles.message}>{ ' ' + trip.name + '.' }</Text>
        </Text>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.delete} onPress={() => this.props.complete(this.props.notificationId)}>
            <Ionicons name='ios-close' style={styles.deleteIcon}/>
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
    flex: 4.3,
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
    flex: 0.7,
    flexDirection: 'row'
  },
  delete: {
    flex: 1,
    height: 30,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: white
  },
  deleteIcon: {
    color: gray,
    fontSize: 30
  }
})
