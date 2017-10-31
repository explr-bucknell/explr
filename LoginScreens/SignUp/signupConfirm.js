import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
import { FontAwesome } from '@expo/vector-icons';
import { StackNavigator } from 'react-navigation';
import { primary, white } from '../../utils/colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const MARGIN_LEFT = DEVICE_WIDTH * 0.1;
const MARGIN_RIGHT = MARGIN_LEFT;

const SKIP = DEVICE_HEIGHT / 10;

export default class SignupConfirm extends Component {
	constructor(props) {
		super(props);
    	this.state = {
    		disabled: false,
    		firstName: this.props.nav.state.params.firstName,
    		lastName: this.props.nav.state.params.lastName,
    		email: this.props.nav.state.params.email,
    		pwd: this.props.nav.state.params.pwd,
    	};
	}
	render() {
		return (
			<View style={styles.container}>
				<FontAwesome name="paper-plane" style={styles.icon}/>
				<Text style={styles.title}>Confirm your email address</Text>
				<Text style={styles.text}>We sent a confirmation email to:</Text>
				<Text style={styles.emailText}>{this.state.email}</Text>
				<Text style={styles.text}>Check your email and click on the confirmation link to continue.</Text>
				<View style={styles.bottom}>
					<TouchableOpacity disabled={this.state.disabled} onPress={() => {this.props.nav.navigate("SignUpDone")}}>
						<Text style={styles.resendText}>Resend email</Text>
			    	</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: SKIP,
		marginLeft: MARGIN_LEFT,
		marginRight: MARGIN_RIGHT,
		marginBottom: MARGIN_LEFT,
		justifyContent:'center',
		alignItems: 'center',
	},
	icon: {
		flex: 5,
		fontSize: 100,
		color: white,
	},
	title: {
		flex: 1.5,
		fontSize: 20,
		color: white,
		fontWeight: '700',
	},
	text: {
		flex: 1,
		fontSize: 15,
		color: white,
		fontWeight: '400',
		textAlign: 'center',
	},
	emailText: {
		flex: 1,
		fontSize: 15,
		color: white,
		fontWeight: '700',
	},
	bottom: {
		flex: 4,
		justifyContent: 'flex-end',
	},
	resendText: {
		fontSize: 16,
		color: white,
		fontWeight:'700',
	},
});
