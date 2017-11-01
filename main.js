import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { primary, white } from './utils/colors';
import firebase from 'firebase';

export default class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	getDisplayName() {
		var user = firebase.auth().currentUser;
		return user.displayName;
	}

	render() {
		return (
			<View>
				<Text>Hello {this.getDisplayName()}:</Text>
				<Text>You are logged in!</Text>
			</View>
		);
	}
}
