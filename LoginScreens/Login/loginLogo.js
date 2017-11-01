import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Dimensions from 'Dimensions';
import { FontAwesome } from '@expo/vector-icons';
import { primary, white } from '../../utils/colors';

const DEVICE_HEIGHT = Dimensions.get('window').height;
const SKIP = DEVICE_HEIGHT / 8;

export default class LoginLogo extends Component {
	render() {
		return (
			<View style={styles.container}>
				<FontAwesome name="map" style={styles.logo}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 2.5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		fontSize: 50,
		color: primary,
		marginTop: SKIP,
	},
});
