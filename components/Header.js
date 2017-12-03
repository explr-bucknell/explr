import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { primary, white, gray, black } from '../utils/colors'

export default class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
  	console.log(this.props.imageUrl);
    return (
      
      	<View style={styles.header}>
      		<View style={styles.textContainer}>
	      		<View style={styles.nameContainer}>
	      			<Text style={styles.name}>{this.props.displayName}</Text>
	      			<Text style={styles.handle}>{this.props.handle}</Text>
	      		</View>
	      		<View style={styles.followContainer}>
	      			<TouchableOpacity style={styles.followers}>
	      				<Text style={styles.followValue}>{this.props.numFollowers}</Text>
	      				<Text style={styles.followLabel}>Followers</Text>
	      			</TouchableOpacity>
	      			<TouchableOpacity style={styles.following}>
	      				<Text style={styles.followValue}>{this.props.numFollowing}</Text>
	      				<Text style={styles.followLabel}>Following</Text>
	      			</TouchableOpacity>
	      		</View>
	      	</View>
      		<View style={styles.profileContainer}>
						<View style={styles.profilePicHolder}>
							<Image style={styles.profilePic} source={ this.props.imageUrl ? {uri: this.props.imageUrl} : (require('../assets/images/profilePic.png')) } />
						</View>
					</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		paddingBottom: 0,
		backgroundColor: white,
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		paddingBottom: 0,
		backgroundColor: white
	},
	profileContainer: {
		flex: 1,
	},
	profilePicHolder: {
		width: 90,
		height: 90,
		borderRadius: 50,
		borderColor: gray,
		borderWidth: 6,
		marginBottom: 40
	},
	profilePic: {
		flex: 1,
		width: 78,
		height: 78,
		borderRadius: 39,
		borderWidth: 0
	},
	textContainer: {
		flex: 2.5,
	},
	nameContainer: {
		flexDirection: 'column'
	},
	name: {
		marginTop: 5,
		fontSize: 22,
		color: black,
		fontWeight: 'bold'
	},
	handle: {
		marginTop: 10,
		fontSize: 15,
		color: gray,
		fontWeight: 'bold'
	},
	followContainer: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 20,
	},
	followers: {
		flex: 1,
		marginRight: 30
	},
	following: {
		flex: 1,
		marginRight: 30
	},
	followValue: {
		fontSize: 15,
		color: black,
		fontWeight: 'bold'
	},
	followLabel: {
		fontSize: 15,
		color: gray,
		fontWeight: 'bold'
	}
});
