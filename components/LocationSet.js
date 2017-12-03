import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { white, gray } from '../utils/colors'

export default class LocationSet extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<View style={styles.container}>
				<Text>{this.props.title}</Text>
				<View>
					
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 0, 
		backgroundColor: white
	},
	content: {

	}
})
