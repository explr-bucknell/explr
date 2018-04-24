import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { StyleSheet, ScrollView, Text } from 'react-native' // eslint-disable-line no-unused-vars
import firebase from 'firebase'
import { getJoinedOrFollowedTrips } from '../network/trips'
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
    var self = this
    this.tripsRef = getJoinedOrFollowedTrips(this.props.uid, this.props.joined, (trips) => { self.setState({ trips }) })
  }

  componentWillUnmount() {
    this.tripsRef.off('value')
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
