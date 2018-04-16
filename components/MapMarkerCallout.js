import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native' // eslint-disable-line no-unused-vars
import { FontAwesome } from '@expo/vector-icons' // eslint-disable-line no-unused-vars
import firebase from 'firebase'
import { primary, white } from '../utils/colors'

//Displays preview of POI above it's pin when pressed
export default class MapMarkerCallout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      liked: false
    }
  }

  componentDidMount() {
    this.checkLiked(this.props.id, this.props.uid)
  }

  checkLiked(id, uid) {
    var ref = firebase.database().ref('users/main/' + uid + '/saved')
    var self = this
    var liked
    ref.child(id).on('value', function(snapshot) {
      if (snapshot.val()) {
        liked = true
      } else {
        liked = false
      }
      self.setLiked(liked)
    })
  }

  setLiked (liked) {
    this.setState({ liked })
  }

  async addLiked () {
    this.setState({
      liked: true
    })

    await firebase.database().ref('users/main/' + this.props.uid + '/saved/' + this.props.id).set({
      name: this.props.title,
      image: this.props.imageUrl
    })
  }

  async removeLiked() {
    this.setState({
      liked: false
    })

    await firebase.database().ref('users/main/' + this.props.uid + '/saved/' + this.props.id).set(null)
  }

  render () {
    return (
      <TouchableOpacity
        style={styles.calloutWrapper}
        onPress={
          () => !this.props.trip ?
          this.props.navigate('LocationPage', {location: this.props}) :
          this.props.locationPress()
        }
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
