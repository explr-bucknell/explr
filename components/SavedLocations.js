import React from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import ContentGrid from './ContentGrid'
import LocationSet from './LocationSet'
import { white } from '../utils/colors'

export default class SavedLocations extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<ContentGrid />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 0, 
		backgroundColor: white
	}
})
