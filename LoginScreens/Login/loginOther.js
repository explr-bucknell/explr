import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
import { FontAwesome } from '@expo/vector-icons';
import { primary, white, gray, facebook, twitter, google } from '../../utils/colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const MARGIN = DEVICE_WIDTH * 0.125;
const WIDTH = DEVICE_WIDTH / 6;
const HEIGHT = WIDTH;
const RADIUS = HEIGHT / 2;

export default class LoginOther extends Component {
 	render() {
    	return (
    		<View style={styles.container}>
    			<View style={styles.divider}>
    				<View style={styles.line}/>
    				<Text style={styles.text}>  OR CONNECT WITH  </Text>
    				<View style={styles.line}/>
    			</View>
    			<View style={styles.buttonWrap}>
    				<TouchableOpacity style={[styles.button, styles.facebook]} onPress={() => null}>
				    	<FontAwesome name="facebook" style={styles.logo}/>
				    </TouchableOpacity>
				    <TouchableOpacity style={[styles.button, styles.twitter]} onPress={() => null}>
				    	<FontAwesome name="twitter" style={styles.logo}/>
				    </TouchableOpacity>
				    <TouchableOpacity style={[styles.button, styles.google]} onPress={() => null}>
				    	<FontAwesome name="google" style={styles.logo}/>
				    </TouchableOpacity>
    			</View>
			</View>
    	);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 3.5,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: MARGIN,
		marginRight: MARGIN,
		marginTop: 20,
	},
	divider: {
		flexDirection: 'row',
		flex: 1,
	},
	line: {
		flex: 1,
		borderTopColor: gray,
		borderTopWidth: 1,
		height: 1,
		marginTop: 6,
	},
	text: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 12,
		color: gray,
		fontSize: 10,
		fontWeight: "600",
	},
	buttonWrap: {
		flexDirection: 'row',
		flex: 3,
	},
	button: {
		width: WIDTH,
		height: HEIGHT,
		borderRadius: RADIUS,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: WIDTH / 4,
		marginRight: WIDTH / 4,
	},
	facebook: {
		backgroundColor: facebook,
	},
	twitter: {
		backgroundColor: twitter,
	},
	google: {
		backgroundColor: google,
	},
	logo: {
		color: white,
		fontSize: 25,
	}
});
