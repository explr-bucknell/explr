import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { getPOIAutocomplete } from '../network/pois'
import { primary, white, gray, black } from '../utils/colors'

export default class SearchPlaces extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ids: [],
			names: []
		}
	}

	componentDidMount() {
		this.props.nav.setParams({ handlePlaceSearch: this.handleTextChange })
	}

	handleTextChange = (text) => {
		if (!text) {
			this.setState({ ids:[], names:[] })
			return
		}
		//console.log(text)

		getPOIAutocomplete(text).then((data) => {
			var ids = []
			var names = []
			data.forEach(function(poi) {
				ids.push(poi.id)
				names.push(poi.name)
			})
			this.setState({ ids, names })
		})
	}

	render() {
		return (
			<ScrollView style={styles.searchContainer}>
				{this.state.names.map((name, i) => (
					<TouchableOpacity key={i} style={styles.profileCard} onPress={() => this.props.nav.navigate('MapPage', { id: this.state.ids[i] })}>
						<View style={styles.textWrapper}>
							<Text style={styles.name}>{name}</Text>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	searchContainer: {
		flex: 1
	},
	profileCard: {
		flexDirection: 'row',
		backgroundColor: white
	},
	textWrapper: {
		margin: 10
	},
	name: {
		marginTop: 5,
		color: black,
		fontSize: 16,
		fontWeight: 'bold'
	},
})
