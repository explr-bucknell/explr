import React from "react"
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title } from "native-base"
import { FontAwesome } from '@expo/vector-icons'
import { primary, white, gray, black, transparentWhite } from '../utils/colors'
import ContentGrid from '../components/ContentGrid'
import SavedLocations from '../components/SavedLocations'
import UserTrips from '../components/UserTrips'
import SettingsPage from './SettingsPage'
import { getCurrUid, getUserProfile, getUserFollowStatus, getProfilePic } from '../network/users'
import { sendFollowRequest, stopFollowing } from '../network/notifications'

const {width: SCREEN_WIDTH} = Dimensions.get("window")
const HEADER_HEIGHT = 150
const TAB_HEIGHT = 50
const SCROLL_HEIGHT = HEADER_HEIGHT + TAB_HEIGHT

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
  	var currUid = getCurrUid()
  	if (currUid == uid) {
  		this.setState({
  			isMyProfile: true,
  			currUid: currUid
  		})
  	} else {
      getUserFollowStatus(currUid, uid, this.onGetFollowStatusComplete)
  	}

    getUserProfile(uid, this.updateProfile)
  }

  onGetFollowStatusComplete = (currUid, isFollowing) => {
    this.setState({
      isMyProfile: false,
      currUid: currUid,
      isFollowing: isFollowing
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
    	getProfilePic(snapshot.imageUrl, this.onGetProfilePicComplete)
    }
  }

  onGetProfilePicComplete = (imageUrl) => {
		this.setState({ imageUrl })
	}

  settings = () => {
    this.state.nav('SettingsPage', {loginNav: this.props.loginNav, uid: this.state.uid, refreshProfile: this.refresh})
  }

  refresh = (url) => {
    this.setState({
      imageUrl: this.imageUrl + '/'
    })
  }

  render() {
    const { uid, currUid, nav, isMyProfile, isFollowing, displayName, handle, numFollowers, numFollowing, imageUrl } = this.state
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
		      				<Text style={styles.name}>{ displayName.length < 16 ? displayName: (displayName.slice(0,13) + "...") }</Text>
		      				<TouchableOpacity onPress={() => (isMyProfile ? this.settings() : (isFollowing ? stopFollowing(uid, currUid) : sendFollowRequest(uid, currUid)))}>
				            <FontAwesome
				            	name={isMyProfile ? 'cogs' : 'user-plus'}
				            	style={isFollowing ? styles.iconFollowing : styles.icon}
				            />
				          </TouchableOpacity>
				        </View>
		      			<Text style={styles.handle}>{'@' + handle}</Text>
		      		</View>
		      		<View style={styles.followContainer}>
		      			<TouchableOpacity style={styles.followers} onPress={() => nav('FollowersPage', {uid: uid, type: "followers"})}>
		      				<Text style={styles.followValue}>{numFollowers}</Text>
		      				<Text style={styles.followLabel}>Followers</Text>
		      			</TouchableOpacity>
		      			<TouchableOpacity style={styles.following} onPress={() => nav('FollowingPage', {uid: uid, type: "following"})}>
		      				<Text style={styles.followValue}>{numFollowing}</Text>
		      				<Text style={styles.followLabel}>Following</Text>
		      			</TouchableOpacity>
		      		</View>
	      		</View>
      			<View style={styles.profileContainer}>
							<View style={styles.profilePicHolder}>
								<Image style={styles.profilePic} key={ new Date() } source={ imageUrl ? {uri: imageUrl} : (require('../assets/images/profilePic.png')) } />
							</View>
						</View>
					</View>

      		<Tabs renderTabBar={(props) =>
      			<Animated.View
          		style={{transform: [{translateY: this.tabY}], zIndex: 1, width: "100%", backgroundColor: white, borderBottomWidth: 2, borderColor: white}}>
          		<ScrollableTab {...props}
          			style={{borderBottomWidth: 0, height: 50, shadowOffset: { width: 0, height: 4 }, shadowColor: 'rgba(0,0,0,0.2)', shadowOpacity: 0.5}}
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
						<Tab heading="Liked Places">
							<SavedLocations uid={uid}/>
						</Tab>
	  				<Tab heading="Trips">
							<UserTrips uid={uid} currUser={currUid} navigate={nav} isMyProfile={isMyProfile} isFollowing={isFollowing} />
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
		borderWidth: 2,
		marginBottom: 40
	},
	profilePic: {
		flex: 1,
		width: 86,
		height: 86,
		borderRadius: 43,
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
