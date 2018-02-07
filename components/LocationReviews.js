import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import { primary, white } from '../utils/colors';

export default class Review extends Component {
  render() {
    return (
      <View style={styles.reviewSection}>
        <View style={styles.userInfo}>
          <Image style={styles.image} source={require('../assets/images/profilePic.png')} />
          <Text>First Last</Text>
          <Text>Rating</Text>
        </View>
        <View style={styles.review}>
          <Text>{this.props.review}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  reviewSection: {
    flex: 1,
    flexDirection: 'row',
    borderColor: primary,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5
  },
  userInfo: {
    flex: 0.1,
  },
  review: {
    flex: 1,
    marginLeft: 10,
  },
  image: {
    margin: 5,
    width: 90,
    height: 90
  }
});