import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { white, primary } from '../utils/colors'

const trips = [
	{name: 'Nat parks trip!', index: 1},
	{name: 'Sightseeing', index: 2},
	{name: 'Coffeeshop exploration', index: 3}
]

class TripContainer extends Component {
	render () {
		console.log(this.props)
		return (
			<View style={styles.tripContainer}>
				<Text style={{fontSize: 18, color: 'black'}}>{this.props.tripName}</Text>
					<Ionicons
							name='ios-arrow-dropright'
							size={25}
							style={{ color: primary }}
						/>
			</View>
		)
	}
}

export default class UserTrips extends Component {

	_keyExtractor = (item, index) => item.index;

	render () {
		console.log(this.props)
		return (
			<View style={styles.tripsContainer}>
				<FlatList
					style={{width: '100%', paddingBottom: 3}}
					contentContainerStyle={{flexDirection: 'column'}}
					data={trips}
  				renderItem={({item}) => <TripContainer tripName={item.name}/>}
					keyExtractor={this._keyExtractor}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	tripsContainer: {
		flex: 1,
		backgroundColor: white,
		alignItems: 'center',
	},
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
