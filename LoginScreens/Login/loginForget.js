import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
import { primary, white, gray } from '../../utils/colors';

export default class LoginForget extends Component {
	constructor(props) {
		super(props);
	}

 	render() {
    	return (
    		<View style={styles.container}>
				<TouchableOpacity><Text style={styles.text}>Forgot Password?</Text></TouchableOpacity>
				<TouchableOpacity onPress={() => {this.props.nav.navigate('SignUpName')}}><Text style={styles.text}>New Here? Sign Up</Text></TouchableOpacity>
			</View>
    	);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 0.8,
		marginLeft: 20,
		marginRight: 20,
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	text: {
		color: gray,
		backgroundColor: 'transparent',
		fontSize: 12,
		fontWeight: '500',
	},
});
