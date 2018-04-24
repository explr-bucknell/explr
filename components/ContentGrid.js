import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import {
	StyleSheet,
	View, // eslint-disable-line no-unused-vars
	Text, // eslint-disable-line no-unused-vars
	Image, // eslint-disable-line no-unused-vars
	TouchableOpacity, // eslint-disable-line no-unused-vars
	Dimensions, // eslint-disable-line no-unused-vars
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons' // eslint-disable-line no-unused-vars
import { black, liked } from '../utils/colors'
import { getCurrUid, getSavedLocations } from '../network/users'
import CardView from 'react-native-cardview'

// Grid for displaying users' liked/saved locations
export default class ContentGrid extends Component {
	constructor(props) {
		super (props)
		this.state = {
			ids: [],
			names: [],
			images: [],
			liked: []
		}
	}

	componentWillMount () {
		var self = this
		var uid = this.props.uid

		this.locationsRef = getSavedLocations(uid, this.onGetSavedLocationsComplete)
	}

	componentWillUnmount() {
		this.locationsRef.off('value')
	}

	onGetSavedLocationsComplete = (locations) => {
		var uid = this.props.uid
		var currUid = getCurrUid()
		if (currUid == uid) {
			this.updateGrid(locations)
		} else {
			this.updateGrid(locations, currUid)
		}
	}

	updateGrid (locations, uid=null) {
		var ids = Object.keys(locations)
		var names = ids.map(id => locations[id].name)
		var images = ids.map(id => locations[id].image)
		var liked = []

		if (uid == null) {
			liked = ids.map(() => true)
			this.setState({ ids, names, images, liked })
		} else {
			this.setState({ ids, names, images })
			var self = this
			getSavedLocations(uid, (content) => { self.setState({ liked: ids.map(id => (content[id] != null)) }) })
		}
	}

	addLiked (i) {
		var liked = Object.assign([], this.state.liked)
		liked[i] = true
		this.setState({ liked })
	}

	removeLiked (i) {
		var liked = Object.assign([], this.state.liked)
		liked[i] = false
		this.setState({ liked })
	}

	render() {
		return (
			<View>
				<View style={styles.contentGrid}>
					{this.state.names ? (this.state.names.map((name, i) =>
						<CardView
		          cardElevation={2}
		          cardMaxElevation={2}
		          cornerRadius={5}
		          key={i}
		          style={ i%2 ? styles.photoWrapRight : styles.photoWrapLeft }
		          >
		          <Image style={styles.photo} source={{ uri: this.state.images[i] }} />
							<View style={styles.row}>
								<TouchableOpacity style={styles.titleWrap}>
									<Text style={styles.title}>{name}</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.iconWrapper} onPress={() => { this.state.liked[i] ? this.removeLiked(i) : this.addLiked(i) }}>
									<FontAwesome name={this.state.liked[i] ? 'heart' : 'heart-o'} style={styles.icon}/>
								</TouchableOpacity>
							</View>
						</CardView>
					)) : (<Text style={styles.noText}>No saved locations yet</Text>)}
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	contentGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		height: '100%'
	},
	noText: {
		fontSize: 20,
		color: black
	},
	photoWrapLeft: {
		margin: 5,
		marginRight: 3,
		padding: 3,
		width: (Dimensions.get('window').width / 2) - 8,
		elevation: 1
	},
	photoWrapRight: {
		margin: 5,
		marginLeft: 3,
		padding: 3,
		width: (Dimensions.get('window').width / 2) - 8,
		elevation: 1
	},
	photo: {
		flex: 1,
		width: null,
		height: 120,
		borderRadius: 5
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 50,
		overflow: 'hidden'
	},
	titleWrap: {
		left: 5,
		flex: 4
	},
	title: {
		fontSize: 15,
		color: black,
		backgroundColor: 'transparent'
	},
	icon: {
		fontSize: 20,
		color: liked,
		right: 5
	},
	iconWrapper: {
		backgroundColor: 'transparent',
		flex: 1,
		alignItems: 'flex-end'
	}
})
