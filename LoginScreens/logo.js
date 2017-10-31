import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Dimensions from 'Dimensions';
import { FontAwesome } from '@expo/vector-icons';
import { primary, white } from '../utils/colors';

const DEVICE_HEIGHT = Dimensions.get('window').height;
const SKIP = DEVICE_HEIGHT / 3.5;

export default class Logo extends Component {
	render() {
		return (
			<View style={styles.container}>
				<FontAwesome name="map" style={styles.logo}/>
				<Text style={styles.text}>EXPLR</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		fontSize: 35,
		color: white,
		marginTop: SKIP,
	},
	text: {
		color: white,
		fontWeight: '300',
		marginTop: 20,
		fontSize: 25,
	}
});
