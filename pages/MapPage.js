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
import MapMarkerCallout from '../components/MapMarkerCallout'
import { StackNavigator, headerMode, navigationOptions } from 'react-navigation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Modal from 'react-native-modalbox'
import { getLocations } from '../network/Requests'
import NatParkProf from './NationalParkProfile'

class MapScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false,
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

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
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
    //console.log(this.props)
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
          onLongPress={e => this.setModalVisible(true)}
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
                  pinColor={locationType === 'national_parks' ? 'green' : 'blue'}
                >
                  <MapView.Callout
                    onPress={() => this.props.navigate.navigate('NatParkProf', 
                    {
                      name: locationName, //getting the name with locations[locationType][locationName].name throws an error and I've not been able to figure it out 
                      description: 'Lovely location', 
                      uid: this.props.uid
                    })} >
                    <MapMarkerCallout
                      title={locations[locationType][locationName].name}
                      // description='asdfasdf'
                      imageUrl={locations[locationType][locationName].image} //'https://www.naturallyamazing.com/americasparks/490.jpg'
                      id={locations[locationType][locationName].id}
                      uid={this.props.uid}
                      navigate={this.props.navigate}
                    />
                  </MapView.Callout>
                </MapView.Marker>
              )
            )
          }
        </MapView>
        {/*<Toolbar
          searchChange={(text) => this.handleSearchChange(text)}
          ref={(instance) => this.toolbar = instance}
        />*/}
      </View>
    )
  }
}

const MapS = ( {navigation}) => (
  <MapScreen navigate={navigation}/>
);

const NatParkProfScreen = ( {navigation}) => (
  <NatParkProf navigate={navigation}/>
);

const AppNavigation = StackNavigator({
    HomeScreen: {
      screen: MapS,
      navigationOptions: {
        headerMode: 'screen',
        header: null,
      },
    },
    NatParkProf: {
      screen: NatParkProfScreen,
      navigationOptions: {
        headerMode: 'screen',
        header: null,
      },
    },
  })

export default class MapPage extends React.Component{
  render() {
    return <AppNavigation />
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
  googleSearch: {
    height: 300
  }
})
