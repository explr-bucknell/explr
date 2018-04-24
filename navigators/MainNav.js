import React from 'react'
import { TouchableOpacity, Text, TextInput, Platform } from 'react-native'
import Dimensions from 'Dimensions'
import { StackNavigator, navigationOptions, NavigationActions } from 'react-navigation'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import MapNav from './MapNav'
import SearchPage from '../pages/SearchPage'
import ProfilePage from '../pages/ProfilePage'
import LocationProfile from '../pages/LocationProfile'
import TripProfilePage from '../pages/TripProfilePage'
import TripPage from '../pages/TripPage'
import CreateTripPage from '../pages/CreateTripPage'
import EditTripPage from '../pages/EditTripPage'
import TripMapPage from '../pages/TripMapPage'
import ConnectionsPage from '../pages/ConnectionsPage'
import ProfileEditPage from '../pages/ProfileEditPage'
import ChangePwdPage from '../pages/ChangePwdPage'
import SettingsPage from '../pages/SettingsPage'
import OptimizeTripPage from '../pages/OptimizeTripPage'
import TagPage from '../pages/TagPage'
import { primary, white, transparentWhite } from '../utils/colors'

const DEVICE_WIDTH = Dimensions.get('window').width
var searchEntry = ""

const MapNavOpts = ({ navigation }) => ({
	headerTitle: "XPLOR",
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerRight:
		<TouchableOpacity onPress={() => { navigation.navigate("SearchPage", { displayPOI: navigation.state.params.displayPOI }) }} style={{ marginRight: 10 }}>
			<FontAwesome
		      name='search'
		      size={20}
		      style={{ color: white }}
		    />
		</TouchableOpacity>,
	headerTintColor: white,
	headerBackTitle: null,
})

const LocationPageOpts = ({ navigation }) => ({
	headerTitle: "XPLOR",
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerLeft:
		<TouchableOpacity onPress={() => navigation.goBack(null)} style={{ marginLeft: 10 }}>
			<FontAwesome
					name='angle-left'
					size={35}
					style={{ color: white }}
				/>
		</TouchableOpacity>,
	headerTintColor: white,
})

const TripProfilePageOpts = ({ navigation }) => ({
	headerTitle: 'Trip',
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerLeft:
		<TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingLeft: 10, paddingRight: 10 }}>
			<FontAwesome
		      name='angle-left'
		      size={35}
		      style={{ color: white }}
		    />
		</TouchableOpacity>,
	headerRight:
		<TouchableOpacity onPress={
			() => navigation.navigate('TripMapPage',
			{trip: navigation.state.params.trip, uid: navigation.state.params.uid})} style={{ marginRight: 10 }}>
			<FontAwesome
					name='map'
					size={25}
					style={{ color: white }}
				/>
		</TouchableOpacity>
})

const TripPageOpts = ({ navigation }) => ({
	headerTitle: navigation.state.params.trip.name,
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerLeft:
		<TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingLeft: 10, paddingRight: 10 }}>
			<FontAwesome
				name='angle-left'
				size={35}
				style={{ color: white }}
			/>
		</TouchableOpacity>,
	headerRight:
		<TouchableOpacity onPress={
			() => navigation.navigate('TripMapPage',
			{trip: navigation.state.params.trip, uid: navigation.state.params.uid})} style={{ marginRight: 10 }}>
			<FontAwesome
					name='map'
					size={25}
					style={{ color: white }}
				/>
		</TouchableOpacity>
})

const OptimizeTripPageOpts = ({ navigation }) => ({
	headerTitle: `Optimizing: ${navigation.state.params.tripName}`,
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerLeft:
		<TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingLeft: 10, paddingRight: 10 }}>
			<FontAwesome
				name='angle-left'
				size={35}
				style={{ color: white }}
			/>
		</TouchableOpacity>,
})

const TripMapPageOpts = ({ navigation }) => ({
	headerTitle: `XPLOR: ${navigation.state.params.trip.name}`,
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerLeft:
		<TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingLeft: 10, paddingRight: 10 }}>
			<FontAwesome
		      name='angle-left'
		      size={35}
		      style={{ color: white }}
		    />
		</TouchableOpacity>,
})

const CreateTripNavOpts = ({ navigation }) => ({
	headerTitle: "New Trip",
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerRight:
		<TouchableOpacity onPress={() => navigation.state.params.finishNewTrip && navigation.state.params.finishNewTrip()}>
			<Ionicons
					name='ios-checkmark'
					style={{ color: white, marginRight: 15, fontSize: 45 }}
		  	/>
		</TouchableOpacity>
})

const EditTripNavOpts = ({ navigation }) => ({
	headerTitle: "Edit Trip",
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerRight:
		<TouchableOpacity onPress={() => navigation.state.params.finishEditTrip && navigation.state.params.finishEditTrip()}>
			<Ionicons
					name='ios-checkmark'
					style={{ color: white, marginRight: 15, fontSize: 45 }}
		  	/>
		</TouchableOpacity>
})

const SearchNavOpts = ({ navigation }) => ({
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTitle:
		<TextInput
        placeholder="Search for places here"
      	onChangeText={ (text) => {
      		navigation.state.params.handlePlaceSearch && navigation.state.params.handlePlaceSearch(text.trim())
      		navigation.state.params.handleUserSearch && navigation.state.params.handleUserSearch(text.trim())
      		navigation.state.params.handleTagSearch && navigation.state.params.handleTagSearch(text.trim())
      	}}
        placeholderTextColor={ transparentWhite }
        autoFocus={ true }
        selectionColor={ Platform.OS === 'android' ? transparentWhite : white }
        underlineColorAndroid='rgba(0,0,0,0)'
				autoCorrect={ false }
        style={{
       		width: DEVICE_WIDTH * 0.6,
					height: 40,
					color: white,
					fontSize: 16,
					borderColor: white,
	       }}
	    />,
	headerLeft:
		<FontAwesome
				name='search'
				size={25}
				style={{ color: white, marginLeft: 15 }}
	  	/>,
	headerRight:
		<TouchableOpacity onPress={() => navigation.goBack(null)} style={{ marginRight: 10 }}>
			<Text style={{ color: white, fontSize: 18 }}>Cancel</Text>
		</TouchableOpacity>
})

const FollowersNavOpts = ({ navigation }) => ({
	headerTitle: "Followers",
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white
})

const FollowingNavOpts = ({ navigation }) => ({
	headerTitle: "Following",
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white
})

const ProfileEditNavOpts = ({ navigation }) => ({
	headerTitle: "Edit Profile",
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerRight:
		<TouchableOpacity onPress={() => navigation.state.params.submitProfileEdit && navigation.state.params.submitProfileEdit()}>
			<Ionicons
					name='ios-checkmark'
					style={{ color: white, marginRight: 15, fontSize: 45 }}
		  	/>
		</TouchableOpacity>
})

const ChangePwdNavOpts = ({ navigation }) => ({
	headerTitle: "Change Password",
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerRight:
		<TouchableOpacity onPress={() => navigation.state.params.changePassword && navigation.state.params.changePassword()}>
			<Ionicons
					name='ios-checkmark'
					style={{ color: white, marginRight: 15, fontSize: 45 }}
		  	/>
		</TouchableOpacity>
})

const SettingsPageOpts = ({ navigation }) => ({
	headerTitle: 'Settings',
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerLeft:
		<TouchableOpacity onPress={() => navigation.goBack(null)} style={{ marginLeft: 10 }}>
			<FontAwesome
					name='angle-left'
					size={35}
					style={{ color: white }}
				/>
		</TouchableOpacity>,
})

const TagPageOpts = ({ navigation }) => ({
	headerTitle: `#${navigation.state.params.tag}`,
	headerStyle: {
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTintColor: white,
	headerLeft:
		<TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingLeft: 10 }}>
			<FontAwesome
				name='angle-left'
				size={35}
				style={{ color: white }}
			/>
		</TouchableOpacity>,
})

const MapScreen = (props) => (
	<MapNav screenProps={Object.assign({}, props.navigation, props.screenProps)}/>
)

const LocationScreen = ({ navigation }) => (
	<LocationProfile nav={navigation}/>
)

const TripProfileScreen = ({ navigation }) => (
	<TripProfilePage nav={navigation} />
)

const TripScreen = ({ navigation }) => (
	<TripPage nav={navigation} />
)

const OptimizeTripScreen = ({ navigation }) => (
	<OptimizeTripPage nav={navigation} />
)

const TripMapScreen = ({ navigation }) => (
	<TripMapPage nav={navigation} />
)

const CreateTripScreen = ({ navigation }) => (
	<CreateTripPage nav={navigation}/>
)

const EditTripScreen = ({ navigation }) => (
	<EditTripPage nav={navigation}/>
)

const SearchScreen = ({ navigation }) => (
	<SearchPage nav={navigation}/>
)

const FollowersScreen = ({ navigation }) => (
	<ConnectionsPage nav={navigation}/>
)

const FollowingScreen = ({ navigation }) => (
	<ConnectionsPage nav={navigation}/>
)

const ProfileScreen = ({ navigation }) => (
	<ProfilePage nav={navigation}/>
)

const ProfileEditScreen = ({ navigation }) => (
	<ProfileEditPage nav={navigation}/>
)

const ChangePwdScreen = ({ navigation }) => (
	<ChangePwdPage nav={navigation}/>
)

const SettingsScreen = ({ navigation }) => (
	<SettingsPage nav={navigation} />
)

const TagScreen = ({ navigation }) => (
	<TagPage nav={navigation} />
)

const MainNavigator = StackNavigator({
	MapPage: {
		screen: props => MapScreen(props),
		navigationOptions: MapNavOpts
	},
	SearchPage: {
		screen: SearchScreen,
		navigationOptions: SearchNavOpts
	},
	ProfilePage: {
		screen: ProfileScreen,
		navigationOptions: MapNavOpts
	},
	ProfileEditPage: {
		screen: ProfileEditScreen,
		navigationOptions: ProfileEditNavOpts
	},
	ChangePwdPage: {
		screen: ChangePwdScreen,
		navigationOptions: ChangePwdNavOpts
	},
	FollowersPage: {
		screen: FollowersScreen,
		navigationOptions: FollowersNavOpts
	},
	FollowingPage: {
		screen: FollowingScreen,
		navigationOptions: FollowingNavOpts
	},
	TripProfilePage: {
		screen: TripProfileScreen,
		navigationOptions: TripProfilePageOpts
	},
	TripPage: {
		screen: TripScreen,
		navigationOptions: TripPageOpts
	},
	OptimizeTripPage: {
		screen: OptimizeTripScreen,
		navigationOptions: OptimizeTripPageOpts
	},
	CreateTripPage: {
		screen: CreateTripScreen,
		navigationOptions: CreateTripNavOpts
	},
	EditTripPage: {
		screen: EditTripScreen,
		navigationOptions: EditTripNavOpts
	},
	TripMapPage: {
		screen: TripMapScreen,
		navigationOptions: TripMapPageOpts
	},
	LocationPage: {
		screen: LocationScreen,
		navigationOptions: LocationPageOpts
	},
	SettingsPage: {
		screen: SettingsScreen,
		navigationOptions: SettingsPageOpts
	},
	TagPage: {
		screen: TagScreen,
		navigationOptions: TagPageOpts
	}
})

export default MainNavigator
