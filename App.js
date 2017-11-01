import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginNavigator from './LoginScreens/index';
import { primary, white } from './utils/colors';
import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBztce7Z8iOrB5EgV4IE8gjlFGAy6MXSkQ",
    authDomain: "senior-design-explr.firebaseapp.com",
    databaseURL: "https://senior-design-explr.firebaseio.com",
    projectId: "senior-design-explr",
    storageBucket: "senior-design-explr.appspot.com",
    messagingSenderId: "866651490806"
};
firebase.initializeApp(config);

export default class App extends React.Component {
	render() {
		return (
			<View style={{flex: 1}}>
				<LoginNavigator />
			</View>
		);
	}
}
