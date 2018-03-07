import React from "react"
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title } from "native-base"
import firebase from 'firebase'
import { FontAwesome } from '@expo/vector-icons'
import { primary, white, gray, black, transparentWhite } from '../utils/colors'
import ContentGrid from '../components/ContentGrid'
import SavedLocations from '../components/SavedLocations'
import UserTrips from '../components/UserTrips'

const {width: SCREEN_WIDTH} = Dimensions.get("window")
const HEADER_HEIGHT = 150
const TAB_HEIGHT = 50
const SCROLL_HEIGHT = HEADER_HEIGHT + TAB_HEIGHT
const FOLLOW_ENDPOINT = 'https:///us-central1-senior-design-explr.cloudfunctions.net/sendFollowNotification/'
export default class ProfilePage extends React.Component {
  scroll = new Animated.Value(0)
  tabY = this.scroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + TAB_HEIGHT, SCROLL_HEIGHT + TAB_HEIGHT + 1],
    outputRange: [0, 0, 2 * TAB_HEIGHT, 2 * TAB_HEIGHT + 1]
  })

  constructor(props) {
    super(props)
    this.state = {
    	uid: null,
    	nav: null,
    	displayName: "",
    	handle: "",
    	numFollowers: null,
    	numFollowing: null,
    	imageUrl: null,
    	currUid: null,
    	isMyProfile: null,
    	isFollowing: null
    }
  }

  componentWillMount() {
  	this.setState({
  		uid: this.props.uid ? this.props.uid : this.props.nav.state.params.uid,
  		nav: this.props.navigate ? this.props.navigate : this.props.nav.navigate
  	})
  }

  componentDidMount() {
  	var self = this
  	var uid = this.state.uid
  	var currUser = firebase.auth().currentUser
  	if (currUser && currUser.uid == uid) {
  		this.setState({
  			isMyProfile: true,
  			currUid: currUser.uid
  		})
  	} else {
  		var ref = firebase.database().ref('users/main/' + currUser.uid + '/following')
  		ref.orderByKey().equalTo(uid).on('value', function(snapshot) {
  			if (snapshot.numChildren()) {
  				self.setState({
  					isMyProfile: false,
  					currUid: currUser.uid,
  					isFollowing: true
  				})
  			}
  			else {
  				self.setState({
  					isMyProfile: false,
  					currUid: currUser.uid,
  					isFollowing: false
  				})
  			}
  		})
  	}

  	const url = 'users/main/' + this.state.uid
  	var userRef = firebase.database().ref(url)

  	userRef.on('value', function(snapshot) {
  		self.updateProfile(snapshot.val())
  	})
  }

  updateProfile = (snapshot) => {
  	this.setState({
  		displayName: snapshot.firstname + ' ' + snapshot.lastname,
  		handle: snapshot.handle,
      numFollowers: snapshot.numFollowers,
      numFollowing: snapshot.numFollowing,
    })
    if (snapshot.imageUrl) {
    	this.getProfileImg(snapshot.imageUrl)
    }
  }

  getProfileImg = (url) => {
		var self = this
		var gsReference = firebase.storage().ref(url)
		gsReference.getDownloadURL().then(function(imageUrl) {
			self.setState({ imageUrl })
		})
	}

  sendFollowRequest = () => {
  	var self = this
  	var ref = firebase.database().ref('users/notifications/' + this.state.uid)
  	ref.orderByChild('data/sender').equalTo(this.state.currUid).once('value', function(snapshot) {
  		if (snapshot.numChildren() == 0) {
  			self.newFollowRequest()
  		}
  	})
  }

  newFollowRequest = () => {
  	var uid = this.state.uid
  	var ref = firebase.database().ref('users/notifications/')
  	var newKey = ref.child(uid).push().key
  	var newRequest = {}
  	newRequest[newKey + '/data/sender'] = this.state.currUid
  	newRequest[newKey + '/time'] = (new Date).getTime()
  	newRequest[newKey + '/type'] = 'FOLLOW_REQUEST'
  	ref.child(uid).update(newRequest).then(function() {
  		console.log("follow request sent")
  	})
    fetch(FOLLOW_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        requester:this.state.currUid, //sending the follow request
        requestee:this.state.uid //who the request is being sent to
      }),
    })
  }

  stopFollowing = () => {
  	console.log("stop following")
  	var { uid, currUid } = this.state
  	var ref = firebase.database().ref('users/main/' + currUid)
		var followingRef = firebase.database().ref('users/main/' + uid)
		ref.child('numFollowing').transaction(function(numFollowing) {
		  return numFollowing - 1
		})
		followingRef.child('numFollowers').transaction(function(numFollowers) {
		  return numFollowers - 1
		})
		ref.child('following/' + uid).remove()
		followingRef.child('followers/' + currUid).remove()
  }

  editProfile = () => {
  	this.state.nav('ProfileEditPage', {uid: this.state.uid})
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
		      				<TouchableOpacity onPress={() => (this.state.isMyProfile ? this.editProfile() : (this.state.isFollowing ? this.stopFollowing() : this.sendFollowRequest()))}>
				            <FontAwesome
				            	name={this.state.isMyProfile ? "edit" : 'user-plus'}
				            	style={this.state.isFollowing ? styles.iconFollowing : styles.icon}
				            />
				          </TouchableOpacity>
				        </View>
		      			<Text style={styles.handle}>{'@' + this.state.handle}</Text>
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
        		</Animated.View>
        	}>
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
		borderWidth: 3,
		marginBottom: 40
	},
	profilePic: {
		flex: 1,
		width: 83,
		height: 83,
		borderRadius: 41.5,
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
  iconFollowing: {
  	marginTop: 8,
		marginLeft: 8,
    fontSize: 20,
    color: primary
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
