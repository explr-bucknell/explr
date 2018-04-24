import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native' // eslint-disable-line no-unused-vars
import ModalDropdown from 'react-native-modal-dropdown'
import { optimizeTrip, calculateDistance } from '../network/Requests'
import { primary, white } from '../utils/colors'

export default class OptimizeTripPage extends Component {
  constructor (props) {
    super (props)
    this.state = {
      locations: [],
      startingLocation: {},
      endingLocation: {}
    }
  }

  componentWillMount () {
    let { locs } = this.props.nav.state.params
    this.setState({
      locations: locs,
      startingLocation: locs[0],
      endingLocation: locs[locs.length - 1]
    })
  }

  _renderDropdownRow (rowData, rowID, highlighted) {
    return (
      <View style={
        {
          borderColor: white,
          padding: 5,
          paddingTop: 10
        }
      }>
        <Text style={{color: white, fontSize: 14}}>{rowData.name}</Text>
      </View>
    )
  }

  _handleStartingLocationSelect (idx, value) {
    this.setState({ startingLocation: value })
  }

  _handleEndingLocationSelect (idx, value) {
    this.setState({ endingLocation: value })
  }

  submitLocs () {
    let { startingLocation, endingLocation, locations } = this.state
    var newLocations = [startingLocation]
    locations.forEach((location, index) => {
      if (!newLocations.includes(location) && location !== endingLocation) {
        newLocations.push(location)
      }
    })
    newLocations.push(endingLocation)
    newLocations.forEach((location, index) => {
      location.index = index
    })
    this.optimizeTrip(newLocations)
  }

  optimizeTrip (newLocations) {
    let { trip } = this.state
    let { tripId, name } = this.props.nav.state.params
    optimizeTrip(newLocations, tripId, name, this.optimizeTripCallback)
  }

  optimizeTripCallback = (newTripArray) => {
    this.props.nav.state.params.onGoBack(newTripArray)
    this.props.nav.goBack(null)
  }

  isValidSelections () {
    if (
      this.state.startingLocation == null || this.state.endingLocation == null ||
      this.state.startingLocation.locId === this.state.endingLocation.locId
    ) {
      return false
    } else {
      return true
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{width: '100%', height: 300, marginTop: 10}}>
          <View style={{flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'space-between', padding: 10}}>
            <View style={{flex: 1}}>
              <View style={{paddingBottom: 10}}>
                <Text style={{color: white, fontSize: 16}}>Starting Location:</Text>
              </View>
              <View style={styles.pickerContainer}>
                <ModalDropdown
                  style={styles.dropDown}
                  options={this.state.locations}
                  renderRow={this._renderDropdownRow.bind(this)}
                  defaultValue={this.state.startingLocation.name}
                  onSelect={(idx, value) => this._handleStartingLocationSelect(idx, value)}
                  textStyle={{fontSize: 16, color: white}}
                  dropdownStyle={styles.dropdownBody}
                  renderButtonText={(rowData) => rowData.name}
                />
              </View>
            </View>
            <View style={{flex: 1}}>
              <View style={{paddingBottom: 10}}>
                <Text style={{color: white, fontSize: 16}}>Ending Location:</Text>
              </View>
              <View style={styles.pickerContainer}>
                <ModalDropdown
                  style={styles.dropDown}
                  options={this.state.locations}
                  renderRow={this._renderDropdownRow.bind(this)}
                  defaultValue={this.state.endingLocation.name}
                  onSelect={(idx, value) => this._handleEndingLocationSelect(idx, value)}
                  textStyle={{fontSize: 16, color: white}}
                  dropdownStyle={styles.dropdownBody}
                  renderButtonText={(rowData) => rowData.name}
                />
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.buttonContainer, !this.isValidSelections() && {backgroundColor: 'rgba(0, 0, 0, 0.25)'}]}
          onPress={() => this.submitLocs()}
          disabled={!this.isValidSelections()}
        >
          <Text style={{color: primary}}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: primary,
    flex: 1,
    justifyContent: 'space-between'
  },
  dropDownContainer: {
    marginLeft: 50,
    flexDirection: 'column'
  },
  pickerContainer: {
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 10
  },
  dropDown: {
    width: '100%'
  },
  dropdownBody: {
    width: '60%',
    height: '100%',
    maxHeight: 300,
    marginTop: 3,
    backgroundColor: primary,
    borderColor: white,
    borderWidth: 1
  },
  buttonContainer: {
    borderRadius: 5,
    backgroundColor: white,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    marginBottom: 20
  },
  toaster: {
    width: '90%',
    alignSelf: 'center',
  }
})
