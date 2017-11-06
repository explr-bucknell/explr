import React from 'react'
import {
  StyleSheet,
  Text, // eslint-disable-line no-unused-vars
  Button, // eslint-disable-line no-unused-vars
  TouchableNativeFeedback, // eslint-disable-line no-unused-vars
  View, // eslint-disable-line no-unused-vars
  Animated, // eslint-disable-line no-unused-vars
  Easing // eslint-disable-line no-unused-vars
} from 'react-native'
import MapView from 'react-native-maps' // eslint-disable-line no-unused-vars
import Sidebar from './components/Sidebar' // eslint-disable-line no-unused-vars
import Toolbar from './components/Toolbar' // eslint-disable-line no-unused-vars

export default class Main extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      sideBarShowing: false
    }
  }

  toggleSideBar () {
    if (!this.state.sideBarShowing) {
      this.sidebar.displaySelf()
    } else {
      this.sidebar.hideSelf()
    }
    this.setState({
      sideBarShowing: !this.state.sideBarShowing
    })
  }

  hideSideBar () {
    if (this.state.sideBarShowing) {
      this.setState({
        sideBarShowing: false
      })
      this.sidebar.hideSelf()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 40.9549774,
            longitude: -76.8813942,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={this.hideSideBar.bind(this)}
        />
        <Toolbar toggleNav={this.toggleSideBar.bind(this)} />
        <Sidebar
          ref={instance => { this.sidebar = instance }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 0
  }
})
