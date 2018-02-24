import React from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title } from "native-base"
import firebase from 'firebase'
import { FontAwesome } from '@expo/vector-icons'
import { primary, white, gray, black, transparentWhite } from '../utils/colors'
import ContentGrid from '../components/ContentGrid'
import SavedLocations from '../components/SavedLocations'
import UserTrips from '../components/UserTrips'

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const HEADER_HEIGHT = 150;
const TAB_HEIGHT = 50;
const SCROLL_HEIGHT = HEADER_HEIGHT + TAB_HEIGHT;

export default class ProfilePage extends React.Component {
  scroll = new Animated.Value(0);
  tabY = this.scroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + TAB_HEIGHT, SCROLL_HEIGHT + TAB_HEIGHT + 1],
    outputRange: [0, 0, 2 * TAB_HEIGHT, 2 * TAB_HEIGHT + 1]
  });

  constructor(props) {
    super(props);
    this.state = {
    	uid: null,
    	nav: null,
    	displayName: "",
    	handle: "",
    	numFollowers: null,
    	numFollowing: null,
    	imageUrl: null,
    	currUid: null,
    	isMyProfile: null
    }
  }

  componentWillMount() {
  	this.setState({
  		uid: this.props.uid ? this.props.uid : this.props.nav.state.params.uid,
  		nav: this.props.navigate ? this.props.navigate : this.props.nav.navigate
  	})
  }

  componentDidMount() {
  	var currUser = firebase.auth().currentUser
  	if (currUser && currUser.uid == this.state.uid) {
  		this.setState({ 
  			isMyProfile: true,
  			currUid: currUser.uid
  		})
  	} else {
  		this.setState({ 
  			isMyProfile: false,
  			currUid: currUser.uid
  		})
  	}

  	var self = this
  	const url = 'users/main/' + this.state.uid
  	var userRef = firebase.database().ref(url)

  	userRef.on('value', function(snapshot) {
  		self.updateProfile(snapshot.val())
  	})
  }

  updateProfile = (snapshot) => {
  	this.setState({
  		imageUrl: snapshot.imageUrl,
  		displayName: snapshot.firstname + ' ' + snapshot.lastname,
  		handle: '@' + snapshot.handle,
      numFollowers: snapshot.numFollowers,
      numFollowing: snapshot.numFollowing,
    })
  }

  sendFollowRequest = () => {
  	console.log('sending request')
  	var uid = this.state.uid
  	var ref = firebase.database().ref("users/notifications/")
  	var newKey = ref.child(uid).push().key
  	var newRequest = {}
  	newRequest[newKey + "/data/sender"] = this.state.currUid
  	newRequest[newKey + "/time"] = (new Date).getTime()
  	newRequest[newKey + "/type"] = "FOLLOW_REQUEST"
  	ref.child(uid).update(newRequest).then(function() {
  		console.log("follow request sent")
  	})
  }

  render() {
    return (
      	<View style={{backgroundColor: white, height: '100%'}}>
        	<Animated.ScrollView
						scrollEventThrottle={1}
						showsVerticalScrollIndicator={false}
						onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.scroll}}}], {useNativeDriver: true})}
						style={{zIndex: 0}}>

          		<View style={styles.header}>
			      		<View style={styles.textContainer}>
				      		<View style={styles.nameContainer}>
				      			<View style={{flexDirection: 'row'}}>
				      				<Text style={styles.name}>{ this.state.displayName.length < 16 ? this.state.displayName: (this.state.displayName.slice(0,13) + "...") }</Text>
				      				<TouchableOpacity onPress={() => {}}>
						            <FontAwesome onPress={() => (this.state.isMyProfile ? null : this.sendFollowRequest())} name={this.state.isMyProfile ? "edit" : 'user-plus'} style={styles.icon}/>
						          </TouchableOpacity>
						        </View>
				      			<Text style={styles.handle}>{this.state.handle}</Text>
				      		</View>
				      		<View style={styles.followContainer}>
				      			<TouchableOpacity style={styles.followers} onPress={() => this.state.nav('FollowersPage', {uid: this.state.uid, type: "followers"})}>
				      				<Text style={styles.followValue}>{this.state.numFollowers}</Text>
				      				<Text style={styles.followLabel}>Followers</Text>
				      			</TouchableOpacity>
				      			<TouchableOpacity style={styles.following} onPress={() => this.state.nav('FollowingPage', {uid: this.state.uid, type: "following"})}>
				      				<Text style={styles.followValue}>{this.state.numFollowing}</Text>
				      				<Text style={styles.followLabel}>Following</Text>
				      			</TouchableOpacity>
				      		</View>
			      		</View>
		      			<View style={styles.profileContainer}>
									<View style={styles.profilePicHolder}>
										<Image style={styles.profilePic} key={ this.state.imageUrl ? this.state.imageUrl : 0 } source={ this.state.imageUrl ? {uri: this.state.imageUrl} : (require('../assets/images/profilePic.png')) } />
									</View>
								</View>
							</View>

          		<Tabs renderTabBar={(props) =>
          			<Animated.View
		          		style={{transform: [{translateY: this.tabY}], zIndex: 1, width: "100%", backgroundColor: white, borderBottomWidth: 2, borderColor: white}}>
		          		<ScrollableTab {...props}
		          			style={{borderBottomWidth: 0, height: 50}}
										renderTab={(name, page, active, onPress, onLayout) => (
											<TouchableOpacity
												key={page}
												onPress={() => onPress(page)}
												onLayout={onLayout}
												activeOpacity={0.4}>
												<TabHeading
													scrollable
													style={{
														backgroundColor: "transparent",
														width: SCREEN_WIDTH / 2,
														borderBottomWidth: 0
													}}
													active={active}>
													<Text style={{
										      	justifyContent: 'center',
														alignItems: 'center',
												    fontWeight: "bold",
														color: active ? primary : gray,
														fontSize: active ? 16 : 15
													}}>
														{name}
													</Text>
												</TabHeading>
											</TouchableOpacity>
										)}
										underlineStyle={{backgroundColor: primary, borderWidth: 0}}
									/>
		        		</Animated.View>}
            	>
    						<Tab heading="Places">
    							<SavedLocations uid={this.state.uid}/>
    						</Tab>
    	  				<Tab heading="Trips">
    							<UserTrips uid={this.state.uid} navigate={this.props.navigate}/>
    						</Tab>
					    </Tabs>
				</Animated.ScrollView>
			</View>
    )
  }
}

const styles = StyleSheet.create({
	header: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		paddingBottom: 0,
		backgroundColor: white,
		height: 150
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
	icon: {
		marginTop: 8,
		marginLeft: 8,
    fontSize: 20,
    color: gray
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
