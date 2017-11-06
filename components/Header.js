import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Image,
	Animated
} from 'react-native';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

	render() {
		return (

			<View style={styles.header}>

				<View style={styles.profilePicHolder}>
					<Image style={styles.profilePic} source={require('../assets/images/profilePic.png')} />
				</View>
				<Text style={styles.name}>Jordan Faith</Text>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	headerBackground: {
		flex: 1,
		width: null,
		alignSelf: 'stretch'
	},
	header: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	profilePicHolder: {
		width: 180,
		height: 180,
		borderRadius: 100,
		borderColor: 'rgba(0,0,0,0.4)',
		borderWidth: 12
	},
	profilePic: {
		flex: 1,
		width: null,
		alignSelf: 'stretch',
		borderRadius: 100,
		borderColor: "#fff",
		borderWidth: 4
	},
	name: {
		marginTop: 20,
		fontSize: 16,
		color: '#fff',
		fontWeight: 'bold'
	},
	backgroundImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		width: null,
		height: HEADER_MAX_HEIGHT,
		resizeMode: 'cover',
	}
});