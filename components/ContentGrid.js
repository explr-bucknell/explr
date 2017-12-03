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

export default class ContentGrid extends Component {
	render() {
		return (
			<View>
				<View style={styles.contentGrid}>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img1.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img2.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img3.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img4.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img5.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img6.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img7.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img8.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img1.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img2.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img3.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img4.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img5.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img6.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img7.jpg')} />
					</View>
					<View style={styles.photoWrap}>
						<Image style={styles.photo} source={require('../assets/images/img8.jpg')} />
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	contentGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	textStyle: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	photoWrap: {
		margin: 2,
		height: 120,
		width: (Dimensions.get('window').width / 2) - 4
	},
	photo: {
		flex: 1,
		width: null,
		alignSelf: 'stretch'
	}
});
