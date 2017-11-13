import React, { Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

export default class MapMarkerCallout extends Component {
  render () {
    return (
      <View style={styles.callout}>
        <Image style={styles.image} source={{uri: this.props.imageUrl}} />
        <Text style={styles.title}>
          {this.props.title}
        </Text>
        <Text style={styles.description}>
          {this.props.description}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  callout: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white'
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    maxWidth: 175,
    color: '#3974d3'
  },
  description: {
    fontSize: 12,
    color: 'lightskyblue'
  },
  image: {
    width: 175,
    height: 175,
    borderRadius: 5
  }
})
