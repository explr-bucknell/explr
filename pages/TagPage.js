import React, { Component } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import firebase from 'firebase'
import { getTrip } from '../network/Requests'
import TripContainer from '../components/TripContainer'
import { white } from '../utils/colors'

export default class TagPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uid: null,
      trips: []
    }
  }

  componentDidMount() {
    var self = this
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        self.loadFollowers(user.uid)
      } else {
        // No user is signed in.
      }
    })
  }

  loadFollowers = uid => {
    var self = this
    var followers = []
    firebase.database().ref(`users/main/${uid}/following`).once('value', function(snapshot) {
      if (snapshot.numChildren()) {
        followers = Object.keys(snapshot.val())
      }
      self.loadTagTrips(uid, followers)
    })
  }

  loadTagTrips = (uid, followers) => {
    var self = this
    // TODO: implement pagination
    var tag = this.props.nav.state.params.tag
    firebase.database().ref(`tags/${tag}/trips`).orderByValue().once('value', function(snapshot) {
      if (snapshot.numChildren()) {
        var tripIds = Object.keys(snapshot.val()).reverse()
        var trips = []
        var count = 0
        tripIds.forEach(tripId => {
          getTrip(tripId).then(trip => {
            count += 1
            if (trip.creator === uid) {
              // do nothing
            }
            else if (trip.permission === 'Only you') {
              if (count === tripIds.length) {
                self.setState({ uid, trips })
              }
              return
            }
            else if (trip.permission === 'Followers' && followers.indexOf(trip.creator) === -1) {
              if (count === tripIds.length) {
                self.setState({ uid, trips })
              }
              return
            }
            trip.tripId = tripId
            trips.push(trip)
            if (count === tripIds.length) {
              self.setState({ uid, trips })
            }
          })
        })
      }
    })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.state.trips.map(item =>
          <TripContainer
            key={item.tripId}
            trip={item}
            navigate={this.props.nav.navigate}
            adding={false}
            currUser={this.state.uid}
          />
        )}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    paddingTop: 20
  }
})
