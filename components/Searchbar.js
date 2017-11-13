import React, { Component } from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'

export default class Searchbar extends Component {
  constructor (props) {
    super (props)
    this.state = {
      searching: false,
      text: ''
    }
  }

  componentWillMount () {
    this.setState({
      searching: this.props.searchBarShowing
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      searching: nextProps.searchBarShowing
    })
  }

  render () {
    return (
      <View style={styles.searchContainer}>
        {
          !this.state.searching &&
          <Icon.Button
            name='search'
            size={30}
            color='white'
            backgroundColor='transparent'
            onPress={this.props.showSearchBar}
            style=
              {{
                padding: 0, margin: 0, borderWidth: 0,
                alignSelf: 'flex-end'
              }}
            iconStyle={{ margin: 0, borderWidth: 0, padding: 0 }}
          />
        }
        {
          this.state.searching &&
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBar}
              value={this.state.text}
              onChangeText={(text) => this.setState({text})}
              placeholderTextColor='black'
              autoFocus
              onBlur={this.props.hideSearchBar}
              returnKeyType='search'
            />
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  searchBarContainer: {
    display: 'flex',
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20
  },
  searchBar: {
    fontSize: 12,
    color: 'black',
    paddingLeft: 10,
    paddingTop: 2,
    height: '100%',
    width: '100%',
    borderColor: 'lightslategrey',
    borderWidth: 1,
    borderRadius: 20,
    textAlign: 'left'
  }

})
