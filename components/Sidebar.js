import React from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';

export default class Sidebar extends React.Component {

  constructor (props) {
    super (props)
    this.state = {
      moveAnim: new Animated.Value(-200),  // Initial value for left pos: -200
    }
  }

  displaySelf () {
    Animated.timing(
      this.state.moveAnim,
      {
        toValue: 0,
        easing: Easing.ease,
        duration: 200,
      }
    ).start();
  }

  hideSelf () {
    Animated.timing(
      this.state.moveAnim,
      {
        toValue: -200,
        easing: Easing.ease,
        duration: 200,
      }
    ).start();
  }

  render () {
    return (
      <Animated.View style={[styles.sidebar, {left: this.state.moveAnim}]}>
        {this.props.children}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 60,
    height: '100%',
    width: 200,
    backgroundColor: 'lightslategrey',
    display: 'flex',
    flexDirection: 'column',
  },
})
