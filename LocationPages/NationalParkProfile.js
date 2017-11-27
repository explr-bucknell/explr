//I know this is ugly, I'll reformat for prettiness once I better understand these horrible animations

import Expo from 'expo';
import React, { Component } from 'react';
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
	ScrollView
} from 'react-native';
import { StackNavigator, headerMode, navigationOptions } from 'react-navigation';
import Review from './LocationReviews'
import Icon from 'react-native-vector-icons/EvilIcons'

export default class NationalParkProfile extends Component {
  render() {
	return (
		<ScrollView style={styles.background}>
			<Image style={styles.locationImage} source={require('../assets/images/img1.jpg')}>
			{/*<Image style={styles.locationImage} source={require(this.props.image)}>*/}
				<View style={styles.header}>
					<Image style={styles.rating} source={require('../assets/images/five-stars.png')} />
				</View>
			</Image>

			<View style={styles.border} />
			<Text style={styles.title}>Yellowstone</Text>
			<Text><Icon name="location" size={30} color="#6e6e6e" style={{ paddingRight: 10 }}/> Yellowstone Address</Text>
			<Text><Icon name="external-link" size={30} color="#6e6e6e" style={{ paddingRight: 10 }}/> Website</Text>
			<Text><Icon name="question" size={30} color="#6e6e6e" style={{ paddingRight: 10 }}/> 555-123-4567</Text>
			<Text><Icon name="clock" size={30} color="#6e6e6e" style={{ paddingRight: 10 }}/> Open 24 Hours</Text>

			{/* <Text style={styles.title}>{this.props.name}</Text>
			<Text><Icon name="location" size={30} color="#6e6e6e" style={{ paddingRight: 10 }}/> {this.props.address}</Text>
			<Text><Icon name="external-link" size={30} color="#6e6e6e" style={{ paddingRight: 10 }}/> {this.props.website}</Text>
			<Text><Icon name="question" size={30} color="#6e6e6e" style={{ paddingRight: 10 }}/> {this.props.phone}</Text>
			<Text><Icon name="clock" size={30} color="#6e6e6e" style={{ paddingRight: 10 }}/> {this.props.hours}</Text>*/}
			

			<View style={styles.border} />
			<Text style={styles.title}>Reviews</Text>
			
			<View style={styles.reviewSection}>
				<Text>
					<Image style={styles.image} source={require('../assets/images/profilePic.png')} />
					Test Name - 5 Stars 11/22/2017
				</Text>
				<Text>This summer, I had the honor of working at Yellowstone as an interpretive park ranger. This place is absolutely incredible. The more you learn about the park, the more you realize how special this place is. Yellowstone houses over 10,000 thermal features (half of the world's geysers are here), over 1,000 miles of hiking trails, and tonsssssss of wildlife. </Text>
			</View>

			<View style={styles.reviewSection}>
				<Text>
					<Image style={styles.image} source={require('../assets/images/profilePic.png')} />
					Test Name - 5 Stars 11/22/2017
				</Text>
				<Text>Yellowstone is a big park but it's easy to navigate once you figure it out. It is a big figure 8 with an upper loop and bottom loop. There are 5 entrances into the park: north, south, east, west and northeast. When you're in the park, don't rely on Google Maps or other navigation. Use the map given to you when you enter the park and follow the signs for major districts which will be bolded on the map. </Text>
			</View>

			<View style={styles.reviewSection}>
				<Text>
					<Image style={styles.image} source={require('../assets/images/profilePic.png')} />
					Test Name - 5 Stars 11/22/2017
				</Text>
				<Text>There are lots of day hikes to do in Yellowstone. I recommend going to a visitor center and picking up hiking pamphlets. They have them for each major districts. I've done quite a few day hikes in the park so message me if you want some recommendations! Don't forget your bear spray.</Text>
			</View>

			<View style={styles.reviewSection}>
				<Text>
					<Image style={styles.image} source={require('../assets/images/profilePic.png')} />
					Test Name - 5 Stars 11/22/2017
				</Text>
				<Text>I had the pleasure of visiting YNP this fall and it was the most beautiful place I've ever been to. You can't go wrong in Yellowstone, to think this is right in our backyard, unbelievable. Remember depending on which season you travel in, will determine what animals you'll see during your visit. Thankfully, the anomaly weather we experienced during our visit granted us the luck of seeing animals we probably wouldnt have unless it was winter. Then again, off season visits mean more chance roads will be closed or excursions not offered. </Text>
			</View>

			<View style={styles.reviewSection}>
				<Text>
					<Image style={styles.image} source={require('../assets/images/profilePic.png')} />
					Test Name - 5 Stars 11/22/2017
				</Text>
				<Text>This place is definitely family friendly, I was surprised to see a lot of older people climbing hikes, but I suppose you'd have to be regularly active. The park is huge, and getting from one place to another by car could take 1-2 hours, so plan ahead. We were able to visit every entrance in the park in one day even with stops and viewing sites. But I'd highly recommend a 3-5 Day stay to really take everything in, I was there for 6. </Text>
			</View>

		</ScrollView>
	);
  }
}

const styles = StyleSheet.create({
  fill: {
		flex: 1,
  },
	header: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	title: {
		fontSize: 16,
		color: '#6e6e6e',
		fontWeight: 'bold'		
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
  	height: 30,
  	width: 150,
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
		borderTopWidth: 2,
		marginTop: 5
	},
	image: {
		marginTop: 5,
		width: 90,
		height: 90,
		borderRadius: 45
	},
	background: {
		backgroundColor: '#D3D3D3'
	}
});
