import React from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import firebase from 'firebase'
import { Ionicons } from '@expo/vector-icons'
import { primary, white, gray, black } from '../../utils/colors'

export default class JoinTripRequest extends React.Component {
  constructor(props) {
    // props.uid
    // props.nav
    // props.notificationId
    // props.data
    // props.complete
    super(props)
  }

  state = {
    requester: {},
    trip: {}
  }

  componentWillMount() {
    var requesterId = this.props.data.requester
    var tripId = this.props.data.tripId
    var requesterRef = firebase.database().ref("users/main/" + requesterId)
    var tripRef = firebase.database().ref("trips/" + tripId)
    var self = this
    requesterRef.once("value", function(snapshot) {
      var data = snapshot.val()
      var requester = {}
      requester.uid = snapshot.key
      requester.name = data.firstname + " " + data.lastname
      requester.handle = data.handle
      if (data.imageUrl) {
        var gsReference = firebase.storage().ref(data.imageUrl)
        gsReference.getDownloadURL().then(function(imageUrl) {
          requester.imageUrl = imageUrl
          self.setState({ requester })
        })
      } else {
        self.setState({ requester })
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

  getProfileImg = (url) => {
    var self = this
    var gsReference = firebase.storage().ref(url)
    gsReference.getDownloadURL().then(function(imageUrl) {
      self.setState({ imageUrl })
    })
  }

  approveRequest = () => {
    var self = this
    var requester = this.state.requester
    var tripId = this.props.data.tripId
    var timestamp = Date.now()
    var tripRef = firebase.database().ref("trips/" + tripId)
    var requesterRef = firebase.database().ref("users/main/" + requester.uid)
    var tripUpdates = {}
    tripUpdates["/participants/" + requester.uid] = timestamp
    var requesterUpdates = {}
    requesterUpdates["/joinedTrips/" + tripId] = timestamp
    tripRef.update(tripUpdates).then(function() {
      requesterRef.update(requesterUpdates).then(function() {
        self.sendApprovalNotification(timestamp)
        self.props.complete(self.props.notificationId)
      })
    })
  }

  denyRequest = () => {
    this.props.complete(this.props.notificationId)
  }

  sendApprovalNotification = timestamp => {
    var uid = this.state.requester.uid
    var ref = firebase.database().ref('users/notifications/')
    var newKey = ref.child(uid).push().key
    var newApproval = {}
    newApproval[newKey + '/data/approver'] = this.props.uid
    newApproval[newKey + '/data/tripId'] = this.props.data.tripId
    newApproval[newKey + '/time'] = timestamp
    newApproval[newKey + '/type'] = 'JOIN_TRIP_APPROVAL'
    ref.child(uid).update(newApproval).then(function() {
      console.log("join trip approval sent")
    })
  }

  render() {
    const { requester, trip } = this.state
    return (
      <TouchableOpacity style={styles.container}>
        <TouchableOpacity onPress={() => this.props.nav('ProfilePage', {uid: this.state.requester.uid})} style={styles.imgWrapper}>
          <Image style={styles.profilePic} source={ requester.imageUrl ? {uri: requester.imageUrl} : (require('../../assets/images/profilePic.png')) } />
        </TouchableOpacity>
        <Text style={styles.textWrapper}>
          <Text style={styles.name}>{ requester.name }</Text>
          <Text style={styles.handle}>{ ' (@' + requester.handle + ') ' }</Text>
          <Text style={styles.message}>has requested to join</Text>
          <Text style={styles.message}>{ ' ' + trip.name + '.' }</Text>
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
