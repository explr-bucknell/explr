import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Button, Platform, NativeModules } from 'react-native'
import Modal from 'react-native-modal'
import { white, primary, transparentWhite, gray } from '../utils/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { getTrip, getPOIAutocomplete, addLocationToTrip, calculateDistance, recreateTrip, optimizeTrip } from '../network/Requests'

const { StatusBarManager } = NativeModules
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT

export default class extends Component {

  constructor (props) {
    super(props)
    this.state = {
      trip: {},
      tripLocations: [],
      oldTripLocations: [],
      addingLocation: false,
      locations: [],
      uid: '',
      editing: false,
      distance: 0
    }
  }

  componentWillMount () {
    this.setState({
      trip: this.props.nav.state.params.trip,
      uid: this.props.nav.state.params.uid,
    }, () => {this.updateTrip()})
  }

  handleTextChange (text) {
		if (!text) {
			this.setState({ locations: [] })
		} else {
			getPOIAutocomplete(text).then((data) => {
				var locations = []
				data.forEach((poi) => {
					locations.push({
						place_id: poi.id,
						name: poi.name
					})
				})
				this.setState({ locations })
			})
		}
	}

  async addLocation (trip_id, place_id, location_name) {
		await addLocationToTrip(trip_id, place_id, location_name)
    .then(() => {this.updateTrip()})
	}

  updateTrip () {
    getTrip(this.state.trip.tripId)
    .then((trip) => {
      var tripLocations = []
      trip.locations && Object.keys(trip.locations).forEach((locId) => {
        trip.locations[locId].locId = locId
        tripLocations[trip.locations[locId].index] = trip.locations[locId]
      })
      trip.tripId = this.state.trip.tripId
      calculateDistance(tripLocations).then((distance) => {
        this.setState({
          distance,
          tripLocations,
          trip,
          addingLocation: false
        })
      })
    })
  }

  cancelLocationSearch () {
		this.setState({
			addingLocation: false,
			locations: []
		})
	}

  deleteLocation (index) {
    let {tripLocations} = this.state
    let updatedLocations = tripLocations.slice(0, index).concat(tripLocations.slice(index + 1))
    let newLocations = []
    for (i = 0; i < updatedLocations.length; i++) {
      newLocations[i] = Object.assign({}, updatedLocations[i], {index: i})
    }
    this.setState({ tripLocations: newLocations })
  }

  increaseIndex(index) {
    let {tripLocations} = this.state
    let maxIndex = tripLocations.length - 1
    let newLocations = []
    if (index < maxIndex) {
      let updatedLocations =
        tripLocations.slice(0, index)
        .concat(tripLocations[index + 1])
        .concat(tripLocations[index])
        .concat(tripLocations.slice(index + 2))
      for (i = 0; i < updatedLocations.length; i++) {
        newLocations[i] = Object.assign({}, updatedLocations[i], {index: i})
      }
      calculateDistance(newLocations).then((distance) => {
        this.setState({distance, tripLocations: newLocations})
      })
    }
  }

  decreaseIndex(index) {
    let {tripLocations} = this.state
    let newLocations = []
    if (index > 0) {
      let updatedLocations =
        tripLocations.slice(0, index - 1)
        .concat(tripLocations[index])
        .concat(tripLocations[index - 1])
        .concat(tripLocations.slice(index + 1))
      for (i = 0; i < updatedLocations.length; i++) {
        newLocations[i] = Object.assign({}, updatedLocations[i], {index: i})
      }
      calculateDistance(newLocations).then((distance) => {
        this.setState({distance, tripLocations: newLocations})
      })
    }
  }

  editOrSubmit () {
    let { trip } = this.state
    if (!this.state.editing) {
      console.log('editing')
    } else {
      recreateTrip(trip.tripId, trip.name, this.state.tripLocations)
    }
    this.setState({
      oldTripLocations: this.state.tripLocations,
      editing: !this.state.editing
    })
  }

  optimizeTrip () {
    let { trip } = this.state
    optimizeTrip(this.state.tripLocations, trip.tripId, trip.name)
    setTimeout(function () {
      getTrip(this.state.trip.tripId)
      .then((trip) => {
        var optimizedLocations = []
        Object.keys(trip.locations).forEach((locId) => {
          let index = trip.locations[locId].index
          trip.locations[locId].locId = locId
          optimizedLocations[index] = trip.locations[locId]
        })
        calculateDistance(optimizedLocations).then((distance) => {
          this.setState({distance, tripLocations: optimizedLocations})
        })
      })
    }.bind(this), 2000)
  }

  render () {
    let {trip, tripLocations} = this.state
    return (
      <View style={{backgroundColor: white, height: '100%', position: 'relative'}}>
        <Modal
          isVisible={this.state.addingLocation}
          backdropColor={'black'}
          backdropOpacity={0}
          style={{margin: 0}}
        >
          <View style={styles.modalContent}>
            <View style={styles.searchBarContainer}>
              <TextInput
                placeholder='Search for locations to add...'
                placeholderTextColor={transparentWhite}
                onChangeText={ (text) => this.handleTextChange(text.trim()) }
                autoFocus={ true }
                style={styles.searchBar}
              />
              <Button title='Cancel' color='white' onPress={() => this.cancelLocationSearch()}/>
            </View>
            <ScrollView>
              {this.state.locations.map((location, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.location}
                  onPress={() => this.addLocation(trip.tripId, location.place_id, location.name)}
                >
                  <Text style={{fontSize: 15}}>{location.name}</Text>
                    <Ionicons
                      name='ios-add-circle-outline'
                      size={25}
                      style={{ color: primary }}
                    />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
        <View>
          { this.state.editing ?
            <View style={styles.editSubmitContainer}>
              <View style={{position: 'absolute', left: 0}}>
                <Button title='cancel'
                  onPress={() => this.setState({
                    tripLocations: this.state.oldTripLocations,
                    editing: !this.state.editing
                  })}
                  color={white}
                />
              </View>
              <View style={{position: 'absolute', right: 0}}>
                <Button title={'submit'}
                  onPress={() => this.editOrSubmit()}
                  color={white}
                />
              </View>
            </View> :
            <View style={styles.toolbarContainer}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: white}}>Manage locations</Text>
              <View style={{flexDirection: 'row'}}>
                <Ionicons
                    name='ios-create-outline'
                    size={25}
                    style={{ color: white, marginRight: 15 }}
                    onPress={() => this.editOrSubmit()}
                />
                <Ionicons
                    name='ios-add-circle-outline'
                    size={25}
                    style={{ color: white }}
                    onPress={() => this.setState({ addingLocation: true })}
                />
              </View>
            </View>
          }
          <ScrollView style={styles.tripLocationsContainer}>
          {tripLocations.length > 0 &&
            tripLocations.map((location) =>
            <View key={location.index} style={styles.tripLocation}>
              {this.state.editing &&
                <TouchableOpacity
                  onPress={() => this.deleteLocation(location.index)}>
                  <Text style={{color: 'red'}}>Delete</Text>
                </TouchableOpacity>
              }
              <View style={[this.state.editing && {width: '60%'}, styles.locationNameContainer]}>
                <Text style={{fontSize: 15}}>
                  {location.name.split(',')[0]}
                </Text>
              </View>
              {this.state.editing &&
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <TouchableOpacity style={[{marginRight: 10}, styles.moveTrip]}
                    onPress={() => this.increaseIndex(location.index)}>
                    <Ionicons
                        name='ios-arrow-round-down'
                        size={35}
                        style={{ color: primary, borderRadius: 50 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={[{marginLeft: 10}, styles.moveTrip]}
                    onPress={() => this.decreaseIndex(location.index)}>
                    <Ionicons
                        name='ios-arrow-round-up'
                        size={35}
                        style={{ color: primary }}
                    />
                  </TouchableOpacity>
                </View>
              }
            </View>
          )}
          {tripLocations.length === 0 &&
            <View style={{width: '100%', justifyContent: 'center', paddingTop: 10}}>
              <Text>You haven't added any locations yet!</Text>
            </View>
          }
          </ScrollView>
        </View>
        <View style={styles.distanceContainer}>
          <Text style={{color: white, fontSize: 16}}>Distance: {this.state.distance} miles</Text>
          {!this.state.editing &&
            <TouchableOpacity style={styles.optimizeButton} onPress={() => this.optimizeTrip()}>
              <Text style={{color: white}}>Optimize Route</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  editSubmitContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primary
  },
  tripLocationsContainer: {
    borderTopWidth: 1,
    borderColor: primary,
    height: '100%',
    marginBottom: 50
  },
  tripLocation: {
    width: '96%',
    alignSelf: 'center',
    borderBottomColor: gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moveTrip: {
    padding: 5,
    borderWidth: 1,
    borderColor: primary,
    borderRadius: 50
  },
  toolbarContainer: {
		height: 50,
		width: '100%',
		backgroundColor: primary,
		alignSelf: 'center',
		alignItems: 'center',
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
  modalContent: {
		margin: 0,
    marginTop: STATUSBAR_HEIGHT,
		padding: 0,
		flex: 1,
		backgroundColor: white
	},
  searchBarContainer: {
		width: '100%',
		height: 50,
		backgroundColor: primary,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row'
	},
  location: {
		height: 44,
		width: '96%',
    alignSelf: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		borderBottomWidth: 1,
		borderColor: gray
	},
  searchBar: {
    width: '80%',
    height: 50,
    color: white,
    fontSize: 15,
    paddingLeft: 10
  },
  locationNameContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  distanceContainer: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: primary,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10
  },
  optimizeButton: {
    backgroundColor: primary,
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginRight: 10
  }
})
