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
						<View key={i} style={ i%2 ? styles.photoWrapRight : styles.photoWrapLeft }>
							<Image style={styles.photo} source={{ uri: this.state.images[i] }} />
              <View style={styles.row}>
                <TouchableOpacity style={styles.titleWrap}>
                  <Text style={styles.title}>{name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconWrapper} onPress={() => {this.state.liked[i] ? this.removeLiked(i) : this.addLiked(i)}}>
                  <FontAwesome name={this.state.liked[i] ? "heart" : 'heart-o'} style={styles.icon}/>
                </TouchableOpacity>
              </View>
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
	photoWrapLeft: {
		margin: 5,
    marginRight: 3,
    padding: 3,
		width: (Dimensions.get('window').width / 2) - 8,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOpacity: 0.5
	},
  photoWrapRight: {
    margin: 5,
    marginLeft: 3,
    padding: 3,
    width: (Dimensions.get('window').width / 2) - 8,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOpacity: 0.5
  },
	photo: {
		flex: 1,
		width: null,
    height: 120,
    borderRadius: 5
	},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    overflow: 'hidden'
  },
  titleWrap: {
    left: 5,
    flex: 4
  },
	title: {
    fontSize: 15,
    color: black,
    backgroundColor: 'transparent'
	},
	icon: {
    fontSize: 20,
    color: liked,
    right: 5
  },
  iconWrapper: {
  	backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'flex-end'
  }
});
