import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
import { FontAwesome } from '@expo/vector-icons';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import { StackNavigator } from 'react-navigation';
import { primary, white, transparentWhite } from '../../utils/colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const MARGIN_LEFT = DEVICE_WIDTH * 0.1;
const MARGIN_RIGHT = MARGIN_LEFT;

const SKIP = DEVICE_HEIGHT / 10;
const INPUT_HEIGHT = DEVICE_HEIGHT * 0.05;

// Round button
const WIDTH = DEVICE_WIDTH / 8;
const HEIGHT = WIDTH;
const RADIUS = WIDTH / 2;

export default class SignupName extends Component {
	constructor(props) {
		super(props);
    	this.state = {
    		firstNameValid: false,
    		lastNameValid: false,
    		disabled: true,
    		firstName: "",
    		lastName: "",
    	};
	}

	checkFirstName(firstName) {
		temp = (firstName.length > 0 ? true : false);
		temp2 = !(temp && this.state.lastNameValid);
		this.setState({
			firstNameValid: temp,
			disabled: temp2,
			firstName: firstName,
		});
		//this.checkEnable();
	}

	checkLastName(lastName) {
		temp = (lastName.length > 0 ? true : false);
		temp2 = !(temp && this.state.firstNameValid);
		this.setState({
			lastNameValid: temp,
			disabled: temp2,
			lastName: lastName,
		});
		//this.checkEnable();
	}

	checkEnable() {
		if (this.state.firstNameValid && this.state.lastNameValid) {
			this.setState({
				disabled: false,
			});
		}
		else {
			this.setState({
				disabled: true,
			});
		}
	}

	getUserData() {
		return {firstName: this.state.firstName, lastName: this.state.lastName};
	}

	render() {
		return (
			<Container style={styles.container}>
				<Content>
					<Form>
						<Item stackedLabel style={styles.item}>
							<Label style={styles.label}>FIRST NAME</Label>
							<Input onChangeText={(text) => this.checkFirstName(text)} autoCorrect={false} keyboardAppearance={'light'} style={styles.input}/>
						</Item>
						<Item stackedLabel style={styles.item}>
							<Label style={styles.label}>LAST NAME</Label>
							<Input onChangeText={(text) => this.checkLastName(text)} autoCorrect={false} keyboardAppearance={'light'} style={styles.input}/>
						</Item>
					</Form>
					<TouchableOpacity disabled={this.state.disabled} style={this.state.disabled ? [styles.button, styles.disabled] : styles.button} onPress={() => {this.props.nav.navigate('SignUpEmail', this.getUserData())}}>
				    	<FontAwesome name="angle-right" style={styles.next}/>
				    </TouchableOpacity>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: SKIP,
		marginLeft: MARGIN_LEFT,
		marginRight: MARGIN_RIGHT,
		justifyContent:'center',
	},
	label: {
		color: white,
		fontSize: 12,
		fontWeight: "700",
		marginBottom: DEVICE_HEIGHT * 0.01,
	},
	input: {
		height: INPUT_HEIGHT,
		color: white,
	},
	item: {
		marginBottom: INPUT_HEIGHT/3,
		paddingLeft: 0,
		marginLeft: 0,
		paddingBottom: 0,
	},
	button: {
		width: WIDTH,
		height: HEIGHT,
		borderRadius: RADIUS,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: SKIP / 3,
		marginLeft: WIDTH * 6 - MARGIN_RIGHT,
		backgroundColor: white,
	},
	next: {
		color: primary,
		fontSize: 35,
	},
	disabled: {
		backgroundColor: transparentWhite,
	},
});
