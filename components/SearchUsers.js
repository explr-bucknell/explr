import React, { Component } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { getUsersByHandle } from '../network/users'
import { primary, white, gray, black } from '../utils/colors'

export default class SearchUsers extends Component {
	constructor(props) {
		super(props)
		this.state = {
			uids: [],
			names: [],
			handles: [],
			images: []
		}
	}

	componentDidMount() {
		this.props.nav.setParams({ handleUserSearch: this.handleTextChange });
	}

	handleTextChange = (text) => {
		if (!text) {
			this.setState({ uids:[], names: [], handles: [], images: [] })
			return
		}
		text = text.toLowerCase()
		getUsersByHandle(text, this.onGetUsersComplete)
	}

	onGetUsersComplete = (uids, names, handles, images) => {
		this.setState({ uids, names, handles, images })
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				{this.state.names.map((name, i) => (
					<TouchableOpacity key={i} style={styles.profileCard} onPress={() => this.props.nav.navigate('ProfilePage', {uid: this.state.uids[i]})}>
						<Image style={styles.profilePic} source={ this.state.images[i] ? {uri: this.state.images[i]} : (require('../assets/images/profilePic.png')) } />
						<View style={styles.textWrapper}>
							<Text style={styles.name}>{name}</Text>
							<Text style={styles.handle}>{this.state.handles[i]}</Text>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
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
