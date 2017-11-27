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
import { StackNavigator, headerMode, navigationOptions } from 'react-navigation';
import MapView from 'react-native-maps' // eslint-disable-line no-unused-vars
import Sidebar from '../components/Sidebar' // eslint-disable-line no-unused-vars
import Toolbar from '../components/Toolbar' // eslint-disable-line no-unused-vars
import MapMarkerCallout from '../components/MapMarkerCallout'
import Profile from '../ProfilePage'
import NatParkProf from '../LocationPages/NationalParkProfile'

class MapPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
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
        <MapView
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
          onPress={this.hideBarElements.bind(this)}
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
                  navigate={this.props.navigate}
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
          navigate={this.props.navigate}
        />
      </View>
    )
  }
}


const MapS = ( {navigation}) => (
  <MapPage navigate={navigation}/>
);

const ProfileScreen = ( {navigation}) => (
  <Profile navigate={navigation}/>
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
    Profile: {
      screen: ProfileScreen,
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

export default class App extends React.Component{
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
    top: 20,
    left: 0,
    right: 0,
    bottom: 0
  }
})
