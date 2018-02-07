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
import firebase from 'firebase';
import { primary, transparentWhite, black } from '../utils/colors';

export default class ContentGrid extends Component {
	constructor(props) {
		super(props)
	}

	state = {
		names: [],
		images: []
	}

	componentWillMount() {
		var self = this
	  	const url = 'users/main/' + this.props.uid
	  	var ref = firebase.database().ref('users/main/' + this.props.uid + '/saved')

	  	ref.on('value', function(snapshot) {
	  		if (snapshot.val()) {
	  			self.updateGrid(snapshot.val())
	  		}
	  	})
	}

	updateGrid = (snapshot) => {
		var names = Object.keys(snapshot).map(location => snapshot[location].name)
		var images = Object.keys(snapshot).map(location => snapshot[location].image)

		this.setState({ names, images })
	}

	render() {
		return (
			<View>
				<View style={styles.contentGrid}>
					{this.state.names ? (this.state.names.map((name, i) => 
						<View key={i} style={styles.photoWrap}>
							<Image style={styles.photo} source={{ uri: this.state.images[i] }}>
								<Text style={styles.title}>
							        {name}
							    </Text>
							</Image>
						</View>
					)) : (<Text style={styles.noText}>No saved locations yet</Text>)}
					{/*
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
					*/}
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
	noText: {
		fontSize: 20,
		color: black
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
		alignSelf: 'stretch',
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
	    margin: 24,
	    fontSize: 15,
	    fontWeight: 'bold',
	    textAlign: 'center',
	    color: transparentWhite,
	    backgroundColor: 'transparent'
	}
});
