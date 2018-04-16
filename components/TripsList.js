import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { StyleSheet, ScrollView, Text } from 'react-native' // eslint-disable-line no-unused-vars
import firebase from 'firebase'
import { getTrip } from '../network/Requests'
import TripContainer from './TripContainer' // eslint-disable-line no-unused-vars
import { white } from '../utils/colors'

// Displays trips for followed or joined trips
export default class TripsList extends Component {
  constructor(props) {
    super (props)
    this.state = {
      trips: []
    }
  }

  componentDidMount() {
    var path = `users/main/${this.props.uid}/`
    if (this.props.joined) {
      path += 'joinedTrips'
    } else {
      path += 'followedTrips'
    }
    var self = this
    firebase.database ().ref (path).orderByValue ().once ('value', function(snapshot) {
      if (snapshot.numChildren ()) {
        var tripIds = Object.keys (snapshot.val ()).reverse ()
        var trips = []
        tripIds.forEach (tripId => {
          getTrip (tripId).then (trip => {
            trip.tripId = tripId
            trips.push (trip)
            if (trips.length === tripIds.length) {
              self.setState ({ trips })
            }
          })
        })
      }
    })
  }

  render() {
    const { trips } = this.state
    return (
      <ScrollView style={styles.container}>
        { trips.length ? trips.map (item =>
          <TripContainer
            key={item.tripId}
            trip={item}
            navigate={this.props.navigate}
            adding={false}
            currUser={this.props.uid}
            user={this.props.joined}
          />
        ) : <Text style={styles.emptyText}>{this.props.joined ? 'No joined trips yet!' : 'No followed trips yet!'}</Text> }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: white,
    paddingTop: 20
  },
  emptyText: {
    alignSelf: 'center'
  }
})
