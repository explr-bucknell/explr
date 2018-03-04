import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native'
import Modal from 'react-native-modal'
import { white, primary } from '../utils/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { getTrip, getPOIAutocomplete, addLocationToTrip } from '../network/Requests'

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
      editing: false
    }
  }

  componentWillMount () {
    let locs = this.props.nav.state.params.trip.locations
    console.log(locs)
    var tripLocations = locs ? Object.keys(locs).map(
      function(locId) {
        locs[locId].locId = locId
        return locs[locId] }
    ) : []
    this.setState({
      trip: this.props.nav.state.params.trip,
      uid: this.props.nav.state.params.uid,
      tripLocations: tripLocations
    })
  }

  handleTextChange (text) {
		if (!text) {
			this.setState({ locations: [] })
		} else {
			getPOIAutocomplete(text).then((data) => {
				var locations = []
				data.forEach((poi) => {
					locations.push({
						place_id: poi.place_id,
						name: poi.name
					})
				})
				this.setState({ locations })
			})
		}
	}

  addLocation (trip_id, place_id, location_name) {
		addLocationToTrip(this.state.uid, trip_id, place_id, location_name)
    .then(this.updateTrip())
	}

  updateTrip () {
    getTrip(this.state.uid, this.state.trip.tripId)
    .then((trip) => {
      trip.tripId = this.state.trip.tripId
      this.setState({ trip })
      this.setState({ addingLocation: false })
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
      this.setState({ tripLocations: newLocations })
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
      this.setState({ tripLocations: newLocations })
    }
  }

  editOrSubmit () {
    if (!this.state.editing) {
      console.log('editing')
    } else {
      console.log('submitting') // call to update db here
      console.log(this.state.tripLocations)
    }
    this.setState({
      oldTripLocations: this.state.tripLocations,
      editing: !this.state.editing
    })
  }

  render () {
    let {trip, tripLocations} = this.state
    return (
      <View style={{backgroundColor: white, height: '100%'}}>
        <Modal
          isVisible={this.state.addingLocation}
          backdropColor={'black'}
          backdropOpacity={0}
          style={{margin: 0}}
        >
          <View style={styles.modalContent}>
            <View style={[styles.tripNameContainer, {marginTop: 10}]}>
              <Text style={{fontSize: 20}}>Adding location to "{trip.name}"</Text>
            </View>
            <View style={styles.searchBarContainer}>
              <TextInput
                onChangeText={ (text) => this.handleTextChange(text.trim()) }
                autoFocus={ true }
                style={styles.searchBar}
              />
              <Button title='Cancel' color='white' onPress={() => this.cancelLocationSearch()}/>
            </View>
            <View>
              {this.state.locations.map((location, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.location}
                  onPress={() => this.addLocation(trip.tripId, location.place_id, location.name)}
                >
                  <Text style={{fontSize: 16}}>{location.name}</Text>
                    <Ionicons
                        name='ios-add-circle-outline'
                        size={25}
                        style={{ color: primary }}
                    />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
        <View style={styles.tripNameContainer}>
          {this.state.editing &&
            <View style={{position: 'absolute', left: 0}}>
              <Button title='cancel'
                onPress={() => this.setState({
                  tripLocations: this.state.oldTripLocations,
                  editing: !this.state.editing
                })}
                color={primary}
              />
            </View>
          }
          <Text style={{fontSize: 20}}>{trip.name}</Text>
          <View style={{position: 'absolute', right: 0}}>
            <Button title={this.state.editing ? 'submit' : 'edit'}
              onPress={() => this.editOrSubmit()}
              color={primary}
            />
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.addLocationContainer}
            onPress={() => this.setState({ addingLocation: true })}
          >
            <Text style={{fontSize: 18, fontWeight: 'bold', color: white}}>Add a location</Text>
            <Ionicons
                name='ios-add-circle-outline'
                size={25}
                style={{ color: white }}
            />
          </TouchableOpacity>
          <ScrollView style={styles.tripLocationsContainer}>
          {tripLocations.length > 0 &&
            tripLocations.map((location) =>
            <View key={location.index} style={styles.tripLocation}>
              {this.state.editing &&
                <TouchableOpacity style={{marginRight: 10}} onPress={() => this.deleteLocation(location.index)}>
                  <Text style={{color: 'red'}}>Delete</Text>
                </TouchableOpacity>
              }
              <View style={{flex: 3, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={{fontSize: 16}}>
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
            <Text>You haven't added any trips yet!</Text>
          }
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tripNameContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripLocationsContainer: {
    borderTopWidth: 1,
    borderColor:
    primary,
    height: '100%'
  },
  tripLocation: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 15,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  moveTrip: {
    padding: 5,
    borderWidth: 1,
    borderColor: primary,
    borderRadius: 50
  },
  addLocationContainer: {
		height: 60,
		width: '100%',
		backgroundColor: primary,
		borderTopColor: white,
		borderTopWidth: 1,
		alignSelf: 'center',
		alignItems: 'center',
		padding: 12,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
  modalContent: {
		margin: 0,
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
		height: 50,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		borderBottomWidth: 1,
		borderColor: 'black'
	},
  searchBar: {
    width: '80%',
    height: 40,
    color: white,
    fontSize: 16,
    paddingLeft: 10
  }
})
