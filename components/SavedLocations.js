import React from 'react'
import { StyleSheet, View } from 'react-native' // eslint-disable-line no-unused-vars
import ContentGrid from './ContentGrid' // eslint-disable-line no-unused-vars
import { white } from '../utils/colors'

export default class SavedLocations extends React.Component {
  render() {
    return (
      <View style={styles.savedLocationContainer}>
        <ContentGrid uid={this.props.uid}/>
      </View>
    )
  }
}

const styles = StyleSheet.create ({
  savedLocationContainer: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: white
  }
})
