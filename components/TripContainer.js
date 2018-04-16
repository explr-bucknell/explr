import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native' // eslint-disable-line no-unused-vars
import { Ionicons } from '@expo/vector-icons' // eslint-disable-line no-unused-vars
import { primary, white, progress } from '../utils/colors'
import { getLocation } from '../network/Requests'

var Scroll_Width = Dimensions.get ('window').width * 0.83
var Btn_Width = Dimensions.get ('window').width * 0.15 - 25

// Thumbnail view of a trip. Displays name, completeness, privacy, and icons for the existing locations
export default class TripContainer extends Component {

  constructor (props) {
    super (props)
    this.state = {
      completed: 0,
      tripIcons: []
    }
  }

  componentWillMount () {
    let locs = this.props.trip.locations
    let numCompleted = 0
    let self = this
    { locs && Object.keys (locs).forEach ((locId) => {
      numCompleted = locs[locId].visited ? numCompleted + 1 : numCompleted
      this.setState ({

      })
      getLocation (locId).then ((location) => {
        let tripIcons = self.state.tripIcons
        tripIcons.push (location.image)
        this.setState ({
          tripIcons
        })
      })
    }) }
    this.setState ({
      completed: numCompleted
    })
  }

  render () {
    let { trip, currUser } = this.props
    const { tripIcons } = this.state
    return (
      <View style={styles.tripContainer}>
        <View style={{flexDirection: 'column'}}>
          <View
            style={styles.touchableContainer}>
            <View style={styles.informationContainer}>
              <Text style={{fontSize: 18, color: 'black'}}>
                {trip.name} ({this.state.completed}/{trip.numLocs} completed)
              </Text>
              <View style={{marginTop: 10}}>
                <Text style={{fontSize: 15}}>Who can see: {trip.permission}</Text>
              </View>
              {tripIcons.length > 0 &&
								<ScrollView horizontal={true} style={{flexDirection: 'row', width: Scroll_Width}} showsHorizontalScrollIndicator={false}>
                {tripIcons.map ((url, index) =>
                  <View key={index} style={styles.locationIcon}>
                    <Image
                      source={{uri: url}}
                      style={{height: 50, width: 50, borderRadius: 25}}
                      key={index}
                    />
                  </View>
                )}
								</ScrollView>
              }
            </View>
          </View>
          {trip.numLocs > 0 &&
						<View style={{flexDirection: 'row', justifyContent: 'flex-start', borderBottomRightRadius: 5, marginRight: Btn_Width}}>
              <View style={[{width: `${(this.state.completed/trip.numLocs) * 100}%`}, styles.progressBar]}/>
						</View>
          }
        </View>
        {!this.props.adding &&
					<TouchableOpacity
            onPress={
              this.props.adding ? () => this.props.selectLocation () :
                () => this.props.navigate (this.props.user ? 'TripPage' : 'TripProfilePage', { trip: trip, currUser: currUser })
            }
            style={styles.selectButtonContainer}
          >
            <Ionicons
              name='ios-arrow-dropright'
              size={25}
              style={{ color: white }}
            />
					</TouchableOpacity>
        }
        {this.props.adding &&
					<TouchableOpacity
            onPress={
              this.props.adding ? () => this.props.selectLocation () :
                () => this.props.navigate ('TripPage', { trip: trip, currUser: currUser })
            }>
            <Ionicons
              name='ios-add-circle-outline'
              size={25}
              style={{ color: primary }}
            />
					</TouchableOpacity>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create ({
  tripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: white,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOpacity: 0.5,
    maxHeight: 156
  },
  touchableContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: Scroll_Width
  },
  informationContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 10
  },
  progressBar: {
    height: 3,
    backgroundColor: progress,
    borderBottomLeftRadius: 5,
  },
  locationIcon: {
    marginRight: 5,
    marginTop: 5,
    padding: 2,
    borderColor: primary,
    borderRadius: 50,
    borderWidth: 2
  },
  selectButtonContainer: {
    height: '100%',
    width: Btn_Width,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: primary,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
