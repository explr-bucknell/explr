import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	Dimensions,
	ScrollView
} from 'react-native';
import firebase from 'firebase';
import { FontAwesome } from '@expo/vector-icons';
import { primary, transparentWhite, black, liked } from '../utils/colors';

export default class ContentGrid extends Component {
	constructor(props) {
		super(props)
	}

	state = {
		ids: [],
		names: [],
		images: [],
		liked: []
	}

	componentWillMount() {
		var self = this
		var uid = this.props.uid
  	const url = 'users/main/' + uid
  	var ref = firebase.database().ref('users/main/' + uid + '/saved')

  	var currUid = firebase.auth().currentUser.uid

  	ref.on('value', function(snapshot) {
  		if (snapshot.val()) {
  			if (currUid == uid) {
  				self.updateGrid(snapshot.val())		// Current logged in user is the owner of saved locations
  			} else {
  				self.updateGrid(snapshot.val(), currUid)
  			}
  		}
  	})
	}

	updateGrid = (snapshot, uid=null) => {
		var ids = Object.keys(snapshot)
		var names = ids.map(id => snapshot[id].name)
		var images = ids.map(id => snapshot[id].image)
		var liked = []

		if (uid == null) {
			liked = ids.map(id => true)
			this.setState({ ids, names, images, liked })
		} else {
			this.setState({ ids, names, images })
			var self = this
			var ref = firebase.database().ref('users/main/' + uid + '/saved')
			ref.on('value', function(snapshot2) {
	  		if (snapshot2.val()) {
	  			var content = snapshot2.val()
	  			var liked = ids.map(id => (content[id] != null))
	  			self.setState({ liked })
	  		}
	  	})
		}
	}

	addLiked = (i) => {
		var liked = Object.assign([], this.state.liked)
		liked[i] = true
		this.setState({ liked })
	}
	
	removeLiked = (i) => {
		var liked = Object.assign([], this.state.liked)
		liked[i] = false
		this.setState({ liked })
	}

	render() {
		return (
			<View>
				<View style={styles.contentGrid}>
					{this.state.names ? (this.state.names.map((name, i) => 
						<View key={i} style={styles.photoWrap}>
							<Image style={styles.photo} source={{ uri: this.state.images[i] }}>
								<Text style={styles.title}>{name}</Text>
								<TouchableOpacity style={styles.iconWrapper} onPress={() => {this.state.liked[i] ? this.removeLiked(i) : this.addLiked(i)}}>
			            <FontAwesome name={this.state.liked[i] ? "heart" : 'heart-o'} style={styles.icon}/>
			          </TouchableOpacity>
							</Image>
						</View>
					)) : (<Text style={styles.noText}>No saved locations yet</Text>)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	contentGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
    height: '100%'
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
	},
	icon: {
    fontSize: 20,
    color: liked
  },
  iconWrapper: {
  	backgroundColor: 'transparent',
  	position: 'absolute',
  	right: 5,
  	bottom: 5
  }
});
