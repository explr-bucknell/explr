import React from 'react'
import {
  StyleSheet,
  Text, // eslint-disable-line no-unused-vars
  Button, // eslint-disable-line no-unused-vars
  TouchableNativeFeedback, // eslint-disable-line no-unused-vars
  View, // eslint-disable-line no-unused-vars
  Animated, // eslint-disable-line no-unused-vars
  Easing // eslint-disable-line no-unused-vars
} from 'react-native'
import MapView from 'react-native-maps' // eslint-disable-line no-unused-vars
import Sidebar from '../components/Sidebar' // eslint-disable-line no-unused-vars
import Toolbar from '../components/Toolbar' // eslint-disable-line no-unused-vars
import MapMarkerCallout from '../components/MapMarkerCallout'
import { getLocations } from '../network/Requests'

export default class MapPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      region: {
        latitude: 40.9549774,
        longitude: -76.8813942,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      locations: {},
      locationsLoaded: false,
      locationTypes: [
        'national_monuments',
        'national_parks'
      ],
      searching: false
    }
  }

  onRegionChange (region) {
    this.setState({ region })
  }

  componentDidMount () {
    let locations = this.state.locations
    this.state.locationTypes.forEach((locationType) => (
      getLocations (locationType)
        .then((data) => {
          locations[locationType] = data
          this.setState({
            locations: locations
          })
        })
    ))

    this.setState({
      locationsLoaded: true
    })
  }

  handleSearchChange (text) {
    console.log(text)
  }

  hideSearchBar () {
    this.toolbar.hideSearchBar()
  }

  render() {
    let locations = this.state.locations
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
          onPress={this.hideSearchBar.bind(this)}
        >
          { Object.keys(locations).length > 0 &&
            Object.keys(locations).map((locationType) =>
              Object.keys(locations[locationType]).map((locationName, index) =>
                <MapView.Marker
                  key={index}
                  coordinate={{
                    latitude: locations[locationType][locationName].lat,
                    longitude: locations[locationType][locationName].long
                  }}
                  pinColor={locationType === 'national_parks' ? 'green' : 'blue'}
                >
                  <MapView.Callout>
                    <MapMarkerCallout
                      title={locations[locationType][locationName].name}
                      description='asdfasdf'
                      imageUrl='https://www.naturallyamazing.com/americasparks/490.jpg'
                    />
                  </MapView.Callout>
                </MapView.Marker>
              )
            )
          }
        </MapView>
        <Toolbar
          searchChange={(text) => this.handleSearchChange(text)}
          ref={(instance) => this.toolbar = instance}
        />
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
    top: 20,
    left: 0,
    right: 0,
    bottom: 0
  },
  sidebar: {
    position: 'absolute',
    top: 60,
    height: '100%',
    width: 200,
    backgroundColor: 'lightslategrey',
    display: 'flex',
    flexDirection: 'column',
  },
})
