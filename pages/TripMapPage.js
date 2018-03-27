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
import { getLocation, getTrip } from '../network/Requests'
import { Location, Permissions } from 'expo'
import MapView from 'react-native-maps' // eslint-disable-line no-unused-vars
import MapMarkerCallout from '../components/MapMarkerCallout'
import { types } from '../utils/poiTypes'
import getDirections from 'react-native-google-maps-directions'

export default class TripMapPage extends Component {

  constructor (props) {
    super (props)
    this.state = {
      region: {
        latitude: 40.9549774,
        longitude: -76.8813942,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      userLocation: {},
      locations: {},
      uid: ''
    }
  }

  normalizeLocations (locations) {
    var self = this
    Object.keys(locations).map((locationId) =>
      getLocation(locationId)
      .then((databaseLocation) => {
        var normalizedLocations = self.state.locations
        normalizedLocations[locationId] = databaseLocation
        self.setState({
          locations: normalizedLocations
        })
      })
    )
  }

  componentWillMount () {
    getTrip(this.props.nav.state.params.trip.tripId)
    .then((trip) =>
      {trip.locations && Object.keys(trip.locations).length > 0 &&
        this.normalizeLocations(trip.locations)
      }
    )
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
                  <MapView.Callout>
                    <MapMarkerCallout
                      title={locations[locationId].name}
                      // description='asdfasdf'
                      imageUrl={locations[locationId].image}
                      id={locations[locationId].id}
                      uid={this.state.uid}
                      navigate={this.props.nav}
                      locationPress={() => this.navToGoogleMaps(locationId)}
                      trip
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
