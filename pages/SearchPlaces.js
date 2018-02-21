import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getPOIAutocomplete } from '../network/Requests'
import { primary, white, gray, black } from '../utils/colors'

export default class SearchPlaces extends React.Component {
	constructor(props) {
		super(props)
	}

	state = {
		ids: [],
		names: []
	}

	componentDidMount() {
		this.props.nav.setParams({ handlePlaceSearch: this.handleTextChange })
	}

	handleTextChange = (text) => {
		console.log("Search places", text)
		if (!text) {
			this.setState({ ids:[], names:[] })
			return
		}
		//console.log(text)
		
		getPOIAutocomplete(text).then((data) => {
			var ids = []
			var names = []
			data.forEach(function(poi) {
				ids.push(poi.place_id)
				names.push(poi.description)
			})
			this.setState({ ids, names })
		})
	}

	render() {
		return (
			<View style={styles.container}>
				{this.state.names.map((name, i) => (
					<TouchableOpacity key={i} style={styles.profileCard} onPress={() => this.props.nav.navigate('MapPage', { id: this.state.ids[i] })}>
						<View style={styles.textWrapper}>
							<Text style={styles.name}>{name}</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	profileCard: {
		flexDirection: 'row',
		backgroundColor: white
	},
	profilePic: {
		width: 50,
		height: 50,
		margin: 10,
		borderRadius: 25,
		borderColor: gray,
		borderWidth: 1
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
	handle: {
		marginTop: 2,
		color: gray,
		fontSize: 14,
		fontWeight: 'bold'
	}
})
