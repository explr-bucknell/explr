import React, { Component } from "react"
import { StyleSheet, Text, Image, View, ScrollView, TouchableOpacity, Button, Dimensions } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import Carousel from 'react-native-snap-carousel'
import firebase from 'firebase'
import { getLocation } from '../network/Requests'
import { primary, black, white, gray, liked } from '../utils/colors'

const WIDTH = Dimensions.get('window').width

export default class TripProfilePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      trip: {},
      locations: [],
      handle: '',
      followed: false,
      joined: false
    }
  }

  currUser = this.props.nav.state.params.currUser

  componentWillMount() {
    let trip = this.props.nav.state.params.trip
    let locs = trip.locations
    var locations = locs ? Object.keys(locs).map(loc => Object.assign({id: loc}, locs[loc])) : []

    var followed = false
    var joined = false
    if (trip.followers && Object.keys(trip.followers).indexOf(this.currUser) != -1) {
      followed = true
    }
    if (trip.participants && Object.keys(trip.participants).indexOf(this.currUser) != -1) {
      joined = true
    }
    this.setState({
      trip,
      followed,
      joined
    })
    this.getHandle(this.props.nav.state.params.trip.creator)
    this.getLocationDetail(locations)
  }

  getHandle = uid => {
    var self = this
    firebase.database().ref('users/handles').orderByValue().equalTo(uid).once('value', function(snapshot) {
      if (snapshot.numChildren()) {
        self.setState({
          handle: Object.keys(snapshot.val())[0]
        })
      }
    })
  }

  getLocationDetail = async locations => {
    var self = this
    var set = false
    var uid = this.props.nav.state.params.currUser
    locations.sort((a, b) => a.index < b.index ? -1 : 1)
    var results = locations.concat()

    var locIds = locations.map(location => location.id)
    var liked
    firebase.database().ref('users/main/' + uid + '/saved').on('value', function(snapshot) {
      if (snapshot.numChildren()) {
        var content = snapshot.val()
        liked = locIds.map(id => (content[id] != null))
      }
      else {
        liked = new Array(locations.length).fill(false)
      }
      results = results.map((location, i) => Object.assign({ liked: liked[i] }, location))
      if (set) {
        self.setState({ locations: results })
      }
      else {
        set = true
      }
    })

    var images = new Array(locations.length).fill(null)
    var count = 0

    locations.forEach((loc, i) => {
      getLocation(loc.id).then((location) => {
        images[i] = location.image
        count += 1
        if (count === locations.length) {
          results = results.map((location, i) => Object.assign({ image: images[i] }, location))
          if (set) {
            self.setState({ locations: results })
          }
          else {
            set = true
          }
        }
      })
    })
  }

  joinTrip = () => {
    var tripId = this.state.trip.tripId
    if (this.state.joined) {
      firebase.database().ref(`users/main/${this.currUser}/joinedTrips`).child(tripId).remove()
      firebase.database().ref(`trips/${tripId}/participants`).child(this.currUser).remove()
      this.setState({ joined: false })
    }
    else {
      var self = this
      var ref = firebase.database().ref('users/notifications/' + this.state.trip.creator)
      ref.orderByChild('data/requester').equalTo(this.currUser).once('value', function(snapshot) {
        if (snapshot.numChildren() == 0) {
          self.sendJoinTripRequest()
        }
        else {
          var data = snapshot.val()
          var found = false
          for (let item of Object.keys(data)) {
            if (data[item].data.tripId === tripId) {
              found = true
              break
            }
          }
          if (!found) {
            self.sendJoinTripRequest()
          }
        }
      })
    }
  }

  sendJoinTripRequest = () => {
    var { creator, tripId } = this.state.trip
    var ref = firebase.database().ref('users/notifications/')
    var newKey = ref.child(creator).push().key
    var newRequest = {}
    newRequest[newKey + '/data/requester'] = this.currUser
    newRequest[newKey + '/data/tripId'] = tripId
    newRequest[newKey + '/time'] = Date.now()
    newRequest[newKey + '/type'] = 'JOIN_TRIP_REQUEST'
    ref.child(creator).update(newRequest).then(function() {
      console.log("join trip request sent")
    })
  }

  followTrip = () => {
    var tripId = this.state.trip.tripId
    if (this.state.followed) {
      firebase.database().ref(`users/main/${this.currUser}/followedTrips`).child(tripId).remove()
      firebase.database().ref(`trips/${tripId}/followers`).child(this.currUser).remove()
      this.setState({ followed: false })
    }
    else {
      var timestamp = Date.now()
      firebase.database().ref(`users/main/${this.currUser}/followedTrips`).child(tripId).set(timestamp)
      firebase.database().ref(`trips/${tripId}/followers`).child(this.currUser).set(timestamp)
      this.setState({ followed: true })
    }
  }

  _renderItem = ({item, index}) => {
    return (
      <View style={styles.locationCard}>
        <Image style={styles.locationPhoto} source={ item.image ? { uri: item.image } : {} } />
        <View style={styles.locationText}>
          <TouchableOpacity>
            <Text style={styles.locationTitle}>{item.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {/*this.state.liked[i] ? this.removeLiked(i) : this.addLiked(i)*/}}>
            <FontAwesome name={item.liked ? "heart" : 'heart-o'} style={styles.icon}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { name, numLocs, tags, followers, participants, creator } = this.state.trip
    const { handle, locations, followed, joined } = this.state
    var numFollowers = followers ? Object.keys(followers).length : 0
    var numParticipants = participants ? Object.keys(participants).length : 0
    return (
      <ScrollView style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.titleWrapper}>
            <Text style={styles.name}>
              { name.length < 25 ? name: (name.slice(0,22) + "...") }
            </Text>
            <Text style={styles.handle}>
              { '  (@' + handle + ')' }
            </Text>
          </View>
          <Text style={styles.subTitle}>
            { numLocs + ' locations \u00b7 ' + numFollowers + ' followers \u00b7 ' + numParticipants + ' participants' }
          </Text>
          { tags ? <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
            { tags.map((tag, index) => (
              <TouchableOpacity style={styles.tag} key={index}>
                <Text style={styles.tagTitle}>{'#' + tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView> : <View />}
        </View>
        <View style={styles.locationContainer}>
          <Carousel
            layout={'default'}
            data={locations}
            renderItem={this._renderItem}
            sliderWidth={WIDTH * 0.95}
            itemWidth={WIDTH * 0.7}
            />
        </View>
        { creator === this.currUser ? 
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.btn, styles.longBtn]} onPress={() => this.props.nav.navigate('TripPage', { trip: this.state.trip, currUser: this.currUser })}>
              <Text style={styles.btnText}>Manage Trip</Text>
            </TouchableOpacity> 
          </View> :
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.btn, styles.shortBtn, styles.joinBtn]} onPress={this.joinTrip}>
              <Text style={styles.btnText}>{ joined ? 'Leave trip' : 'Request to join' }</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.shortBtn, styles.followBtn]} onPress={this.followTrip}>
              <Text style={styles.btnText}>{ followed ? 'Unfollow trip' : 'Follow trip' }</Text>
            </TouchableOpacity>
          </View>
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white
  },
  profileContainer: {
    padding: 20
  },
  locationContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    padding: 10
  },
  titleWrapper: {
    flexDirection: 'row'
  },
  name: {
    marginTop: 5,
    fontSize: 20,
    color: black,
    fontWeight: 'bold'
  },
  handle: {
    marginTop: 7,
    fontSize: 16,
    color: gray,
    fontWeight: 'bold'
  },
  subTitle: {
    marginTop: 10,
    color: black
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 20
  },
  tag: {
    alignItems: 'center',
    backgroundColor: primary + '77',
    borderColor: primary + '55',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
    marginRight: 6,
  },
  tagTitle: {
    color: black,
    fontSize: 15,
    fontWeight: 'normal',
  },
  locationCard: {
    width: WIDTH * 0.7,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOpacity: 0.5,
    padding: 10,
    marginBottom: 5,
  },
  locationPhoto: {
    width: null,
    height: 180,
    borderRadius: 5
  },
  locationText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignItems: 'center',
    overflow: 'hidden'
  },
  locationTitle: {
    fontSize: 15,
    color: black,
    backgroundColor: 'transparent',
  },
  icon: {
    fontSize: 20,
    color: liked
  },
  btn: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  longBtn: {
    width: WIDTH * 0.8,
    backgroundColor: primary
  },
  shortBtn: {
    width: WIDTH * 0.4
  },
  joinBtn: {
    backgroundColor: primary
  },
  followBtn: {
    backgroundColor: liked
  },
  btnText: {
    color: white,
    fontSize: 16
  }
})
