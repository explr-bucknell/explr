import React from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Button } from "react-native"
import { Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title } from "native-base"
import firebase from 'firebase'
import { FontAwesome } from '@expo/vector-icons'
import { primary, white, gray, black, liked } from '../utils/colors'
import ContentGrid from '../components/ContentGrid'
import SavedLocations from '../components/SavedLocations'
import UserTrips from '../components/UserTrips'
import Toaster from '../components/Toaster'
import { getTrips, addLocationToTrip } from '../network/trips'

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const IMAGE_HEIGHT = 150;
const HEADER_HEIGHT = 50;
const SCROLL_HEIGHT = IMAGE_HEIGHT;
const THEME_COLOR = "rgba(85,186,255, 1)";
const FADED_THEME_COLOR = "rgba(85,186,255, 0.8)";

export default class LocationProfile extends React.Component {
  scroll = new Animated.Value(0);
  textColor = primary;
  tabBg = white;
  tabY = this.scroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
    outputRange: [0, 0, 1]
  });
  headerBg = 'transparent';


  tabContent = (x, i) => <View>
    <List>
      {new Array(x).fill(null).map((x, i) => <Item key={i}><Text>Item {i}</Text></Item>)}
    </List></View>;

  constructor(props) {
    super(props);
    this.state = {
      locationName: '',
      imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipOZwaWmeN653QkKPr6dsCoriLzrqyVGw0l6jikG=s1600-h400',
      uid: '',
      locationId: '',
      liked: false,
      addingLocationToTrip: false,
      trips: [],
      errorDisplaying: false
    }
  }

  componentDidMount() {
    let location = this.props.nav.state.params.location
    this.setState({
      locationName: location.title,
      imageUrl: location.imageUrl,
      uid: location.uid,
      locationId: location.id
    })
    this.checkLiked(location.id, location.uid)
  }

  componentWillUnmount() {
    if (this.tripsRef) {
      tripsRef.off('value')
    }
  }

  async checkLiked(id, uid) {
    var ref = firebase.database().ref('users/main/' + uid + '/saved')
    var liked
    await ref.child(id).once("value", function(snapshot) {
      if (snapshot.val()) {
        liked = true
      } else {
        liked = false
      }
    });
    this.setState({ liked })
  }

  async addLiked () {
    this.setState({
      liked: true
    })

    await firebase.database().ref('users/main/' + this.state.uid + '/saved/' + this.state.locationId).set({
      name: this.state.locationName,
      image: this.state.imageUrl
    })
  }

  async removeLiked () {
    this.setState({
      liked: false
    })
    await firebase.database().ref('users/main/' + this.state.uid + '/saved/' + this.state.locationId).set(null)
  }

  toggleAddLocation () {
    if (!this.state.addingLocationToTrip) {
      this.getUserTrips
    }
    this.setState({
      addingLocationToTrip: !this.state.addingLocationToTrip
    })
  }

  closeModal = () => {
    this.setState({ addingLocationToTrip: false })
  }

  addLocation (trip) {
    addLocationToTrip(trip.tripId, this.state.locationId, this.state.locationName)
    .then((result) => {
      if (result === 'failure') {
        this.displayError()
      }
    })
    this.toggleAddLocation()
  }

  displayError() {
    this.setState({ errorDisplaying: true, addingLocation: false})
    setTimeout(() => {
      this.setState({errorDisplaying: false})
    }, 2000)
  }

  getUserTrips () {
    this.tripsRef = getTrips(this.props.uid, this.loadTrips)
  }

  loadTrips = (trips) => {
    const updatedTrips = []
    if (trips && Object.keys(trips).length > 0) {
      Object.keys(trips).forEach((tripId) => {
        trips[tripId].tripId = tripId
        updatedTrips.push(trips[tripId])
      })
      this.setState({
        trips: updatedTrips
      })
    }
  }

  _keyExtractor = (item, index) => item.tripId

  render() {
    let { locationName, imageUrl } = this.state
    let { navigate } = this.props.nav
    return (
      <View style={styles.container}>
        {this.state.errorDisplaying &&
          <View style={styles.toaster}>
            <Toaster text='You&apos;ve already added this location to that trip!'/>
          </View>
        }
        <Modal
          visible={this.state.addingLocationToTrip}
          animationType={'slide'}
        >
          <View style={{marginTop: 20, padding: 10, height: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{width: '60%'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>Adding: {locationName}</Text>
            </View>
            <Button title='cancel' onPress={(() => this.toggleAddLocation())}/>
          </View>
          <ScrollView>
            <UserTrips
              uid={this.state.uid}
              navigate={navigate}
              locationId={this.state.locationId}
              locationName={this.state.locationName}
              addLocation={(trip) => this.addLocation(trip)}
              closeModal={this.closeModal}
              isMyProfile={true}
              isFollowing={null}
              adding
            />
          </ScrollView>
        </Modal>
        <View style={styles.imageContainer}>
          <Image source={{uri: imageUrl}} style={{width: '100%', height: '100%', borderRadius: 5}}/>
        </View>
        <View style={styles.contentContainer}>
          <Text style={{fontSize: 22, color: black, fontWeight: 'bold', marginBottom: 10}}>{locationName}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <TouchableOpacity
              onPress={() => {this.state.liked ? this.removeLiked() : this.addLiked()}}
              style={{marginRight: 20}}>
              <FontAwesome
                name={this.state.liked ? "heart" : 'heart-o'}
                size={35}
                style={styles.heartIcon}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}
              onPress={() => this.toggleAddLocation()}>
              <FontAwesome
                  name='location-arrow'
                  size={35}
                  style={{ color: primary, marginRight: 5 }}
                />
              <Text style={{fontWeight: 'bold', fontSize: 16, color: primary, textDecorationLine: 'underline'}}>Add to trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white
  },
  imageContainer: {
    width: '90%',
    height: 240,
    marginTop: '5%',
    borderWidth: 2,
    borderRadius: 7,
    borderColor: gray,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  contentContainer: {
    margin: '7%'
  },
  heartIcon: {
    color: liked,
  },
  toaster: {
    width: '100%',
    position: 'absolute',
    top: 155,
    zIndex: 3
  }
});
