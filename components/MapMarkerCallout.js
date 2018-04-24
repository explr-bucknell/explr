import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native' // eslint-disable-line no-unused-vars
import { FontAwesome } from '@expo/vector-icons' // eslint-disable-line no-unused-vars
import { primary, white } from '../utils/colors'

//Displays preview of POI above it's pin when pressed
export default class MapMarkerCallout extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <TouchableOpacity
        style={styles.calloutWrapper}
      >
        <Image style={styles.image} source={{uri: this.props.imageUrl}} />
        <View style={styles.detailsWrapper}>
          <View
            style={styles.titleWrapper}
          >
            <Text style={styles.title}>
              {this.props.title}
            </Text>
          </View>
          {this.props.trip &&
            <View
              style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1}}
            >
              <FontAwesome name='angle-right' size={25} style={{color: primary}}/>
            </View>
          }
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  calloutWrapper: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: white
  },
  detailsWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: 200
  },
  titleWrapper: {
    flex: 2,
  },
  title: {
    flex: 1,
    fontSize: 20,
    marginTop: 10,
    maxWidth: 175,
    color: '#3974d3'
  },
  image: {
    width: 200,
    height: 175,
    borderRadius: 5
  }
})
