import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	ScrollView
} from 'react-native';

export default class Review extends Component {
	render() {
		return (
			<View style={styles.reviewSection}>
				<Text>
					<Image style={styles.image} source={require('../assets/images/profilePic.png')} />
					Test Name - 5 Stars
				</Text>
				<Text>Full review posted here.</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
  locationImage: {
		flex: 1,
		width: null,
		alignSelf: 'stretch'  	
  },
  border: {
  	height: 4,
    backgroundColor: 'black'
  },
  rating: {
  	height: 20,
  	width: 100,
  	position: 'absolute',
	  bottom: 0,
	  margin: 10
  },
  contentGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	reviewSection: {
		borderColor: '#333',
		borderWidth: 2,
		borderRadius: 10,
		marginTop: 5,
		marginBottom: 5
	},
	image: {
		margin: 5,
		width: 90,
		height: 90
	}
});