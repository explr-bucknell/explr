import React from 'react'
import { Platform } from 'react-native'
import { TabNavigator, navigationOptions } from 'react-navigation'
import Dimensions from 'Dimensions'
import MapPage from './pages/MapPage'
//import MapNav from './MapNav'
import ProfilePage from './ProfilePage'
import { FontAwesome } from '@expo/vector-icons'
import { primary, white, gray } from './utils/colors'

const DEVICE_HEIGHT = Dimensions.get('window').height;

const MapScreen = () => (
	<MapPage />
)

MapScreen.navigationOptions = {
  tabBarLabel: 'Map',
  tabBarIcon: ({ tintColor, focused }) => (
    <FontAwesome
      name='map'
      size={26}
      style={focused ? { color: primary } : { color: gray }}
    />
  ),
}

const ProfileScreen = () => (
	<ProfilePage />
)

ProfileScreen.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ tintColor, focused }) => (
    <FontAwesome
      name='user'
      size={26}
      style={focused ? { color: primary } : { color: gray }}
    />
  ),
}

const MapNav = TabNavigator({
	MapPage: {
		screen: MapScreen,
	},
	ProfilePage: {
		screen: ProfileScreen,
	}
}
, {
	animationEnabled: true,
  tabBarPosition: "bottom",
	tabBarOptions: {
		activeTintColor: primary,
    inactiveTintColor: gray,
		showIcon: true,
		activeBackgroundColor: white,
		inactiveBackgroundColor: white,
		style: {
			height: Platform.OS === 'android' ? 60 : 50,
      backgroundColor: white,
      borderTopWidth: 0,
      elevation: 5,
      shadowOpacity: 0.2,
      shadowColor: gray
		},
    indicatorStyle: {
      display: 'none'
    }
	}
})

export default MapNav
