import React from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import ContentGrid from './ContentGrid'
import { white } from '../utils/colors'

export default class SavedLocations extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<ContentGrid uid={this.props.uid}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderWidth: 0, 
		backgroundColor: white
	}
})
