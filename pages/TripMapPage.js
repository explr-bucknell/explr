import React, { Component } from 'react'
import {
  StyleSheet,
  Text, // eslint-disable-line no-unused-vars
  Button, // eslint-disable-line no-unused-vars
  TouchableNativeFeedback, // eslint-disable-line no-unused-vars
  View, // eslint-disable-line no-unused-vars
  Animated, // eslint-disable-line no-unused-vars
  Easing,
  Modal,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { getTrip } from '../network/trips'
import { getLocation } from '../network/pois'
import MapView from 'react-native-maps' // eslint-disable-line no-unused-vars
import MapMarkerCallout from '../components/MapMarkerCallout'
import { types } from '../utils/poiTypes'
import getDirections from 'react-native-google-maps-directions'

export default class TripMapPage extends Component {

  constructor (props) {
    super (props)
    this.state = {
      region: {
        latitude: 39.381266,
        longitude: -97.922211,
        latitudeDelta: 73.76,
        longitudeDelta: 33.68
      },
      userLocation: {},
      locations: {},
      uid: ''
    }
  }

  componentWillMount () {
    this.tripRef = getTrip(this.props.nav.state.params.trip.tripId, this.onGetTripComplete)
  }

  componentWillUnmount () {
    this.tripRef.off('value')
  }

  onGetTripComplete = (trip) => {
    if (trip.locations && Object.keys(trip.locations).length > 0) {
      this.normalizeLocations(trip.locations)
    }
  }

  normalizeLocations (locations) {
    Object.keys(locations).map((locationId) =>
      getLocation(locationId, this.onGetLocationComplete)
    )
  }

  onGetLocationComplete = (databaseLocation) => {
    var normalizedLocations = this.state.locations
    normalizedLocations[databaseLocation.id] = databaseLocation
    this.setState({
      locations: normalizedLocations
    })
  }

  navToGoogleMaps (locId) {
    const { userLocation, locations } = this.state
    const data = {
      source: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      },
      destination: {
        latitude: locations[locId].lat,
        longitude: locations[locId].long
      },
    }
    getDirections(data)
  }

  render () {
    let { locations } = this.state
    return (
      <View style={styles.container}>
        <MapView
          style={this.state.editingCustomPin ? styles.mapSquished : styles.map}
          initialRegion={this.state.region}
          region={this.state.region}
          onRegionChangeComplete={(region) => this.setState({ region })}
        >
          { Object.keys(locations).length > 0 &&
            Object.keys(locations).map((locationId, index) =>
              <MapView.Marker
                  key={index}
                  coordinate={{ latitude: locations[locationId].lat, longitude: locations[locationId].long }}
                  pinColor={locations[locationId].type ? types[locations[locationId].type].color : 'green' }
                >
                  <MapView.Callout onPress={() => this.navToGoogleMaps(locationId)}>
                    <MapMarkerCallout
                      title={locations[locationId].name}
                      // description='asdfasdf'
                      imageUrl={locations[locationId].image}
                      id={locations[locationId].id}
                      uid={this.state.uid}
                      locationPress={() => this.navToGoogleMaps(locationId)}
                    />
                  </MapView.Callout>
                </MapView.Marker>
              )
          }
        </MapView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})
