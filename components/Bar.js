import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text
} from 'react-native';

export default class Bar extends Component {
	render() {
		return (

			<View style={styles.bar}>

				<View style={[styles.barItem, styles.barseperator]}>
					<Text style={styles.barTop}>12.750</Text>
					<Text style={styles.barBottom}>Travel Points</Text>
				</View>

				<View style={styles.barItem}>
					<Text style={styles.barTop}>27</Text>
					<Text style={styles.barBottom}>Friends</Text>
				</View>

			</View>
			
		);
	}
}

const styles = StyleSheet.create({
	bar: {
		borderTopColor: '#fff',
		borderTopWidth: 4,
		backgroundColor: '#68d6ff',
		flexDirection: 'row'
	},
	barseperator: {
		borderRightWidth: 4
	},
	barItem: {
		flex: 0.8,
		padding: 14,
		alignItems: 'center'
	},
	barTop: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
		fontStyle: 'italic'
	},
	barBottom: {
		color: '#000',
		fontSize: 14,
		fontWeight: 'bold'
	}

});