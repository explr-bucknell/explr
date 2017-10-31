import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginNavigator from './LoginScreens/index';
import { primary, white } from './utils/colors';
import GlobalFont from 'react-native-global-font';

export default class App extends React.Component {
	/*
	async componentDidMount() {
		let fontName = 'Roboto';
		GlobalFont.applyGlobal(fontName);
	}
	*/
	render() {
		return (
			<View style={{flex: 1}}>
			<LoginNavigator />
			</View>
		);
	}
}
