import React from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import Searchbar from './Searchbar'

export default class Toolbar extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      searchBarShowing: false,
      text: ''
    }
  }

  showSearchBar () {
    this.setState({
      searchBarShowing: true
    })
  }

  hideSearchBar () {
    this.setState({
      searchBarShowing: false
    })
  }

  render () {
    return (
      <View style={styles.toolbar}>
        <View style={{ flex: 1 }}>
          <Icon.Button
            name="navicon"
            size={30}
            color="white"
            backgroundColor="transparent"
            onPress={this.props.toggleNav}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>EXPLR</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Searchbar
            searchBarShowing={this.state.searchBarShowing}
            showSearchBar={this.showSearchBar.bind(this)}
            hideSearchBar={this.hideSearchBar.bind(this)}
          />
        </View>
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
    backgroundColor: 'lightskyblue',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  header: {
    display: 'flex',
    flex: 1,
    width: 75,
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
