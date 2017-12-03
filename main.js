import React from 'react'
import { TouchableOpacity, Text, TextInput, Platform } from 'react-native'
import firebase from 'firebase'
import Dimensions from 'Dimensions'
import { StackNavigator, navigationOptions, NavigationActions } from 'react-navigation'
import { FontAwesome } from '@expo/vector-icons'
import MapNav from './pages/MapNav'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import { primary, white, transparentWhite } from './utils/colors'

const DEVICE_WIDTH = Dimensions.get('window').width
var searchEntry = ""

const handleTextChange = (text) => {
	//console.log(text)
	// TODO: Handle autocomplete for searching
}

const MapScreen = (props) => (
	<MapNav screenProps={props.screenProps}/>
)

const MapNavOpts = ({ navigation }) => ({
	headerTitle: "EXPLR",
	headerStyle: { 
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerRight: 
		<TouchableOpacity onPress={() => navigation.navigate("SearchPage", { handleText: handleTextChange })} style={{ marginRight: 10 }}>
			<FontAwesome
		      name='search'
		      size={20}
		      style={{ color: white }}
		    />
		</TouchableOpacity>,
	headerTintColor: white,
	headerBackTitle: null,
})

const SearchScreen = ({ navigation }) => (
	<SearchPage nav={navigation}/>
)

const SearchNavOpts = ({ navigation }) => ({
	headerStyle: { 
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerTitle:
		<TextInput
	        placeholder="Search for places here"
	      	onChangeText={ (text) => navigation.state.params.handleText(text.trim()) }
	        placeholderTextColor={ transparentWhite }
	        autoFocus={ true }
	        selectionColor={ Platform.OS === 'android' ? transparentWhite : white }
	        underlineColorAndroid='rgba(0,0,0,0)'
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
			size={20}
			style={{ color: white, marginLeft: 15 }}
	    />,
	headerRight:
		<TouchableOpacity onPress={() => navigation.goBack(null)} style={{ marginRight: 10 }}>
			<Text style={{ color: white, fontSize: 18 }}>Cancel</Text>
		</TouchableOpacity>
})

const ProfileScreen = ({ navigation }) => (
	<ProfilePage nav={navigation}/>
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
	}
})

export default MainNavigator
