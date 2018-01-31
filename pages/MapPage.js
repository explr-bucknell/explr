import React from 'react'
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
import MapView from 'react-native-maps' // eslint-disable-line no-unused-vars
import MapMarkerCallout from '../components/MapMarkerCallout'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { getLocations, getLocation, getPOIFromLatLng, getPOIDetails, makePhotoRequest, submitPoiToFirebase } from '../network/Requests'
import SearchFilterOption from '../components/SearchFilterOption'
import CustomPinSearch from '../components/CustomPinSearch'

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
      locationTypes: {
        national_monuments: 'blue',
        national_parks: 'green',
        pois: 'red'
      },
      searching: false,
      customPinSearchCoords: {},
      editingCustomPin: false,
      customPinSearchResults: [],
      selectedFilter: 'park',
      selectedPOI: {}
    }
  }

  componentDidMount () {
    let locations = this.state.locations
    Object.keys(this.state.locationTypes).forEach((locationType) => (
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

  dropPin (coords) {
    if (!this.state.editingCustomPin) {
      this.setState({
        editingCustomPin: true,
        customPinSearchCoords: coords
      })
      this.searchForPOI(coords)
    }
  }

  searchForPOI (coords) {
    getPOIFromLatLng(coords.latitude, coords.longitude, this.state.selectedFilter)
      .then((data) => {
        this.setState({
          customPinSearchResults: data.results,
          customPinSearchCoords: coords
        })
      })
  }

  onRegionChangeComplete (region) {
    this.setState({ region })
  }

  handleSearchChange (text) {
    console.log(text)
  }

  hideSearchBar () {
    this.toolbar.hideSearchBar()
  }

  handleFilterPress (filterName) {
    this.setState({
      selectedFilter: filterName
    }, () => {
      this.searchForPOI(this.state.customPinSearchCoords)
    })
  }

  cancelCustomPin () {
    this.setState({
      editingCustomPin: false,
      customPinSearchCoords: {}
    })
  }

  submitPoi () {
    let poi = this.state.selectedPOI
    let poiType = this.state.selectedFilter
    getPOIDetails(poi.place_id)
      .then((details) => {
          makePhotoRequest(details.result.photos[0].photo_reference)
          .then((photoUrl) => {
            submitPoiToFirebase(poi, photoUrl)
            .then(() => {
              this.updateLocations (poi.place_id)
            })
          })
      })
  }

  updateLocations (id) {
    let locations = this.state.locations
    let pois = locations.pois
    getLocation (id)
    .then((locationData) => {
      pois[id] = locationData
      locations.pois = pois
      this.setState({
        locations,
        editingCustomPin: false,
        customPinSearchCoords: {}
      })
    })
  }

  handlePOISelect (poi) {
    this.setState({
      selectedPOI: poi,
      customPinSearchCoords: {
        latitude: poi.geometry.location.lat,
        longitude: poi.geometry.location.lng
      }
    })
  }

  render() {

    let locations = this.state.locations
    return (
      <View style={styles.container}>
        <MapView
          style={this.state.editingCustomPin ? styles.mapSquished : styles.map}
          initialRegion={this.state.region}
          onRegionChangeComplete={(region) => this.onRegionChangeComplete(region)}
          onLongPress={e => this.dropPin(e.nativeEvent.coordinate)}
          //onPress={this.hideSearchBar.bind(this)}
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
                  pinColor={this.state.locationTypes[locationType]}
                >
                  <MapView.Callout>
                    <MapMarkerCallout
                      title={locations[locationType][locationName].name}
                      // description='asdfasdf'
                      imageUrl={locations[locationType][locationName].image}
                      id={locations[locationType][locationName].id}
                      uid={this.props.uid}
                      navigate={this.props.navigate}
                    />
                  </MapView.Callout>
                </MapView.Marker>
              )
            )
          }
          { this.state.editingCustomPin &&
            <MapView.Marker
              coordinate={this.state.customPinSearchCoords}
              draggable
              onDragEnd={e => this.searchForPOI(e.nativeEvent.coordinate)}
            />
          }
        </MapView>
        {/*<Toolbar
          searchChange={(text) => this.handleSearchChange(text)}
          ref={(instance) => this.toolbar = instance}
        />*/}
        { this.state.editingCustomPin &&
          <CustomPinSearch
            handleFilterPress={(categoryName) => this.handleFilterPress(categoryName)}
            handleOptionSelect={(selectedOption) => this.handlePOISelect(selectedOption)}
            customPinSearchResults={this.state.customPinSearchResults}
            onCancel={() => this.cancelCustomPin()}
            poiSubmit={() => this.submitPoi()}
          />
        }
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
  },
  mapSquished: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 250
  },
  googleSearch: {
    height: 300
  },
  customPinBanner: {
    width: '100%',
    height: 50,
    backgroundColor: 'lightblue',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  resultsContainer: {
    width: '100%',
    height: 200,
  },
  poiContainer: {
    width: '100%',
    height: 50,
    borderColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingLeft: 20,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  filterContainer: {
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 250
  }
})
