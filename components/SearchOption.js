import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { StyleSheet, Text, TouchableOpacity } from 'react-native' // eslint-disable-line no-unused-vars

// A POI result when user is adding their own POI from Google Places API db
export default class SearchOption extends Component {
  render () {
    return (
      <TouchableOpacity
        style={[styles.poiContainer, this.props.selected && {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}
        onPress={() => this.props.handlePOISelect ()}>
        <Text style={[{fontSize: 20}, this.props.selected && {color: 'white'}]}>{this.props.name}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create ({
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
})
