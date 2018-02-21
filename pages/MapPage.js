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
import firebase from 'firebase'
import { FontAwesome } from '@expo/vector-icons'
import { Location, Permissions } from 'expo'
import MapView from 'react-native-maps' // eslint-disable-line no-unused-vars
import MapMarkerCallout from '../components/MapMarkerCallout'
import {
  getLocations,
  getLocation,
  getPOIFromLatLng,
  getPOIDetails,
  makePhotoRequest,
  submitPoiToFirebase
} from '../network/Requests'
import SearchFilterOption from '../components/SearchFilterOption'
import CustomPinSearch from '../components/CustomPinSearch'
import { primary, white, gray, compass } from '../utils/colors'

export default class MapPage extends Component {
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
      /*locationTypes: {
        national_monuments: 'blue',
        national_parks: 'green',
        pois: 'red'
      },*/
      customPinSearchCoords: {},
      editingCustomPin: false,
      customPinSearchResults: [],
      selectedFilter: 'park',
      selectedPOI: {},
      centerChosenPOI: false,
      atCurrentLocation: false
    }
  }

  componentDidMount () {
    this.getCurrentLocation()
    console.log("Get locations")
    let locations = this.state.locations

    // Center map at chosen poi if exists
    if (this.props.state.params && this.props.state.params.id) {
      let place_id = this.props.state.params.id
      getLocation(place_id).then((data) => {
        var locations = {}
        locations[data.id] = data
        this.setState({
          centerChosenPOI: true,
          region: {
            latitude: data.lat,
            longitude: data.long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          locations: locations
        })
      })
    }
    else {
      //this.runGeoQuery(this.state.region)
    }
    
    /*
    getLocations("pois").then((data) => {
      locations = data
      this.setState({
        locations: locations
      })
    })
    
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
    */
  }

  async getCurrentLocation() {
    //const { Location, Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({})
      if (location.coords) {
        var region = {}
        region.latitude = location.coords.latitude
        region.longitude = location.coords.longitude
        region.latitudeDelta = 0.0922
        region.longitudeDelta = 0.0421
        this.setState({ region, atCurrentLocation: true })
      }
      else {
        this.runGeoQuery(this.state.region)
      }
    } else {
      console.log("Permission denied")
    }
  }

  runGeoQuery(region) {
    var ref = firebase.database().ref('pois/')
    var locations = {}
    var self = this
    ref.orderByChild("lat").startAt(region.latitude - region.latitudeDelta/2).endAt(region.latitude + region.latitudeDelta/2).on("value", function(querySnapshot) {
      if (querySnapshot.numChildren()) {
        querySnapshot.forEach(function(poiSnapshot) {
          if ((region.longitude - region.longitudeDelta/2) <= poiSnapshot.val().long && poiSnapshot.val().long <= (region.longitude + region.longitudeDelta/2)) {
            locations[poiSnapshot.key] = poiSnapshot.val()
          }
        });
        self.setState({ locations })
      } else {
        console.log("no poi in this area")
      }
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
    console.log("region changed")
    if (this.state.centerChosenPOI) {
      this.setState({ centerChosenPOI: false })
    }
    else {
      this.setState({ region })
      this.runGeoQuery(region);
    }
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
    getLocation(id).then((locationData) => {
      locations[id] = locationData
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
    console.log("rerender")
    let locations = this.state.locations
    return (
      <View style={styles.container}>
        <MapView
          style={this.state.editingCustomPin ? styles.mapSquished : styles.map}
          initialRegion={this.state.region}
          region={this.state.region}
          onRegionChangeComplete={(region) => this.onRegionChangeComplete(region)}
          onLongPress={e => this.dropPin(e.nativeEvent.coordinate)}
        >
          { Object.keys(locations).length > 0 &&
            Object.keys(locations).map((locationName, index) =>
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: locations[locationName].lat,
                  longitude: locations[locationName].long
                }}
                pinColor={"red"}
              >
                <MapView.Callout>
                  <MapMarkerCallout
                    title={locations[locationName].name}
                    // description='asdfasdf'
                    imageUrl={locations[locationName].image}
                    id={locations[locationName].id}
                    uid={this.props.uid}
                    navigate={this.props.navigate}
                  />
                </MapView.Callout>
              </MapView.Marker>
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
        { this.state.editingCustomPin &&
          <CustomPinSearch
            handleFilterPress={(categoryName) => this.handleFilterPress(categoryName)}
            handleOptionSelect={(selectedOption) => this.handlePOISelect(selectedOption)}
            customPinSearchResults={this.state.customPinSearchResults}
            onCancel={() => this.cancelCustomPin()}
            poiSubmit={() => this.submitPoi()}
          />
        }
        <TouchableOpacity style={styles.compassWrapper} onPress={() => { this.getCurrentLocation() }}>
          <FontAwesome name='dot-circle-o' style={styles.compass}/>
        </TouchableOpacity>
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
  },
  compass: {
    fontSize: 20,
    color: gray
  },
  compassWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
    position: 'absolute',
    right: 15,
    bottom: 15,
    shadowColor: gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1
  }
})
