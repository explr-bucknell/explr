import React, { Component } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { authStateObserver, getConnections } from '../network/users'
import { getTripsByTag } from '../network/trips'
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
    this.authObserver = authStateObserver(this.userSignedIn, () => null)
  }

  componentWillUnmount() {
    this.authObserver()
  }

  userSignedIn = (user) => {
    this.uid = user.uid
    getConnections(user.uid, 'following', this.loadTagTrips)
  }

  loadTagTrips = (following) => {
    var uid = this.uid

    // TODO: implement pagination
    var tag = this.props.nav.state.params.tag
    getTripsByTag(tag, uid, following, this.onGetTripsByTagComplete)
  }

  onGetTripsByTagComplete = (trips) => {
    this.setState({ trips })
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
            currUser={this.uid}
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
