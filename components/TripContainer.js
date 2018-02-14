import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { primary, white, transparentWhite } from '../utils/colors'

export default class TripContainer extends Component {

	render () {
		let trip = this.props.trip
		return (
			<TouchableOpacity
				onPress={() => this.props.navigate('TripPage', {trip: trip, uid: this.props.uid})}
				style={styles.tripContainer}>
				<Text style={{fontSize: 18, color: 'black'}}>{trip.name} (0/{trip.numLocs} completed)</Text>
				<Ionicons
					name='ios-arrow-dropright'
					size={25}
					style={{ color: primary }}
				/>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	tripContainer: {
		height: 60,
		width: '96%',
		alignSelf: 'center',
		borderBottomColor: 'black',
		borderBottomWidth: StyleSheet.hairlineWidth,
		alignItems: 'center',
		padding: 5,
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
})
