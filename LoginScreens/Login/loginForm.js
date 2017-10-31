import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import { primary, secondary, white, gray } from '../../utils/colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const SKIP = DEVICE_HEIGHT / 7;
const MARGIN = DEVICE_WIDTH * 0.125;
const INPUT_HEIGHT = DEVICE_HEIGHT * 0.05;

const BUTTON_WIDTH = DEVICE_WIDTH * 0.75;
const BUTTON_HEIGHT = BUTTON_WIDTH / 7;
const BUTTON_RADIUS = BUTTON_HEIGHT / 2;

export default class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validEmail: false,
			validPwd: false,
		};
	}
	render() {
		return (
			<Container style={styles.container}>
				<Content scrollEnabled={false} style={styles.test}>
					<Form>
						<Item stackedLabel style={styles.item}>
							<Label style={styles.label}>USERNAME / EMAIL</Label>
							<Input autoCapitalize='none' autoCorrect={false} keyboardType={'email-address'} keyboardAppearance={'light'} style={styles.input}/>
						</Item>
						<Item stackedLabel style={styles.item}>
							<Label style={styles.label}>PASSWORD</Label>
							<Input secureTextEntry={true} autoCapitalize='none' keyboardAppearance={'light'} style={styles.input}/>
						</Item>
					</Form>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: SKIP,
		marginLeft: MARGIN,
		marginRight: MARGIN,
		justifyContent:'center',
		flex: 4.5,
	},
	label: {
		color: primary,
		fontSize: 12,
		fontWeight: "700",
		marginBottom: DEVICE_HEIGHT * 0.01,
	},
	test: {
		marginBottom: 0,
		paddingBottom: 0,
	},
	input: {
		height: INPUT_HEIGHT,
		color: secondary,
	},
	item: {
		marginBottom: INPUT_HEIGHT/3,
		paddingLeft: 0,
		marginLeft: 0,
		paddingBottom: 0,
	},
});
