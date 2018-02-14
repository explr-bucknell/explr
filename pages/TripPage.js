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
      addingLocation: false,
      locations: [],
      uid: ''
    }
  }

  componentWillMount () {
    this.setState({
      trip: this.props.nav.state.params.trip,
      uid: this.props.nav.state.params.uid
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
						name: poi.description.split(',')[0]
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

  render () {
    let {trip} = this.state
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
          <Text style={{fontSize: 20}}>{trip.name}</Text>
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
          {Object.keys(trip.locations).map((locationId, index) =>
            <View key={index} style={styles.tripLocation}>
              <Text style={{fontSize: 16}}>
                {trip.locations[locationId].name.split(',')[0]}
              </Text>
            </View>
          )}
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
    paddingLeft: 10
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
