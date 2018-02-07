import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native'
import { primary, white, liked } from '../utils/colors'

export default class SearchFilterOption extends Component {
  render () {
    return (
      <TouchableHighlight style={
          [
            styles.optionContainer,
            {borderColor: this.props.color},
            this.props.selected && {borderWidth: 0, backgroundColor: this.props.color}
          ]
      }
      onPress={this.props.handleFilterPress}
      >
        <Text style={this.props.selected ? {color: 'white'} : { color: 'black' }}>
          {this.props.filterName}
        </Text>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  optionContainer: {
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: white,
    padding: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedContainer: {
    borderColor: white,
  }
})
