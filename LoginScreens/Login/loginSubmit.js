import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
import { primary, white } from '../../utils/colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const WIDTH = DEVICE_WIDTH * 0.75;
const HEIGHT = WIDTH / 7;
const RADIUS = HEIGHT / 2;

export default class LoginSubmit extends Component {
 	render() {
    	return (
    		<View style={styles.container}>
    			<TouchableOpacity style={styles.button} onPress={() => null}>
			    	<Text style={styles.text}>LOGIN</Text>
			    </TouchableOpacity>
			</View>
    	);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		width: WIDTH,
		height: HEIGHT,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: primary,
		borderRadius: RADIUS,
	},
	text: {
		color: white,
		fontWeight: 'bold',
	},
});
