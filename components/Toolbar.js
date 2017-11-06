import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'

export default class Toolbar extends React.Component {
  render () {
    return (
      <View style={styles.toolbar}>
        <Icon.Button
          name="navicon"
          size={25}
          color="white"
          backgroundColor="transparent"
          style={{ paddingLeft: 10 }}
          onPress={this.props.toggleNav}
        />
        <View style={styles.header}>
          <Text style={styles.headerText}>EXPLR</Text>
        </View>
        <Icon name="search" size={30} color="white" style={{ paddingRight: 10 }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    top: 20,
    width: '100%',
    height: 40,
    backgroundColor: '#68d6ff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold'
  },
})
