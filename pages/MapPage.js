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
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import Modal from 'react-native-modalbox'

export default class MapPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false,
      sideBarShowing: false,
      region: {
        latitude: 40.9549774,
        longitude: -76.8813942,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [
        Bald_Eagle = {
          latlng: {
            latitude: 41.0328,
            longitude: -77.6499,
          },
          title: 'Bald Eagle',
          description: 'Lovely state park',
          image: 'https://www.naturallyamazing.com/americasparks/490.jpg'
        },
        Milton = {
          latlng: {
            latitude: 41.0182,
            longitude: -76.8612
          },
          title: 'Milton',
          description: 'Beautiful state park',
          image: 'https://farm5.staticflickr.com/4243/34457148450_9b1b0dcdbf.jpg'
        },
        Hawk_Mountain = {
          latlng: {
            latitude: 40.6456,
            longitude: -75.9799
          },
          title: 'Hawk Mountain',
          description: 'Gorgeous state park',
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Hawk_Mountain_Stannik.jpg/1200px-Hawk_Mountain_Stannik.jpg'
        },
        Hershey_Park = {
          latlng: {
            latitude: 40.2888,
            longitude: -76.6547
          },
          title: 'Hershey Park',
          description: 'Rowdy state park',
          image: 'https://upload.wikimedia.org/wikipedia/en/d/df/Hershey_Park_-_The_Boardwalk.JPG'
        },
        RBWinter_Park = {
          latlng: {
            latitude: 40.9912,
            longitude: -77.1920
          },
          title: 'R.B. Winter State Park',
          description: 'Weird state park',
          image: 'https://media-cdn.tripadvisor.com/media/photo-s/07/cb/66/ad/the-dam-at-rb-winter.jpg'
        },
      ]
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  onRegionChange (region) {
    this.setState({ region })
  }

  toggleSideBar () {
    if (!this.state.sideBarShowing) {
      this.sidebar.displaySelf()
    } else {
      this.sidebar.hideSelf()
    }
    this.setState({
      sideBarShowing: !this.state.sideBarShowing
    })
  }

  hideBarElements () {
    if (this.state.sideBarShowing) {
      this.setState({
        sideBarShowing: false
      })
      this.sidebar.hideSelf()
    }
    if (this.toolbar.state.searchBarShowing) {
      this.toolbar.hideSearchBar()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal position={"bottom"} isOpen={this.state.modalVisible} onClosed={() => this.setState({modalVisible: false})} style={styles.googleSearch}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data);
              console.log(details);
            }}
            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyC2QhtACfVZ2cr9HVvxQuzxd3HT36NNK3Q',
              language: 'en', // language of the results
              //types: '(cities)', // default: 'geocode'
            }}
            styles={{
              description: {
                fontWeight: 'bold',
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
            }}
            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'prominence',
              //types: 'food',
            }}
            debounce={200}
          />
        </Modal>
        <MapView
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
          onPress={this.hideBarElements.bind(this)}
          onLongPress={e => this.setModalVisible(true)}
        >
          { this.state.markers.map((marker, index) => (
            <MapView.Marker
              key={index}
              coordinate={marker.latlng}
              pinColor='green'
            >
              <MapView.Callout>
                <MapMarkerCallout
                  title={marker.title}
                  description={marker.description}
                  imageUrl={marker.image}
                />
              </MapView.Callout>
            </MapView.Marker>
          )) }
        </MapView>
        <Toolbar
          toggleNav={this.toggleSideBar.bind(this)}
          ref={instance => { this.toolbar = instance }}
        />
        <Sidebar
          ref={instance => { this.sidebar = instance }}
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
  googleSearch: {
    height: 300
  }
})
