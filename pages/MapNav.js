import React from 'react'
import { Platform } from 'react-native'
import { TabNavigator, navigationOptions } from 'react-navigation'
import Dimensions from 'Dimensions'
import MapPage from './MapPage'
import ProfilePage from './ProfilePage'
import SettingsPage from './SettingsPage'
import { FontAwesome } from '@expo/vector-icons'
import { primary, white, gray } from '../utils/colors'

const DEVICE_HEIGHT = Dimensions.get('window').height;

const MapScreen = (props) => (
	<MapPage {...props.screenProps} />
)

const ProfileScreen = (props) => (
	<ProfilePage {...props.screenProps} />
)

const SettingsScreen = (props) => (
  <SettingsPage {...props.screenProps} />
)

navOpts = (labelName, iconName) => ({
  tabBarLabel: labelName,
  tabBarIcon: ({ tintColor, focused }) => (
    <FontAwesome
      name={iconName}
      size={26}
      style={focused ? { color: primary } : { color: gray }}
    />
  ),
})

const MapNav = TabNavigator({
	MapPage: {
		screen: props => MapScreen(props),
    navigationOptions: navOpts('Explore', 'map')
	},
	ProfilePage: {
		screen: props => ProfileScreen(props),
    navigationOptions: navOpts('Profile', 'user')
	},
  SettingsPage: {
    screen: props => SettingsScreen(props),
    navigationOptions: navOpts('Settings', 'cogs')
  },
}
, {
	animationEnabled: true,
  tabBarPosition: "bottom",
	tabBarOptions: {
    showLabel: Platform.OS === 'android' ? false : true,
		activeTintColor: primary,
    inactiveTintColor: gray,
		showIcon: true,
		activeBackgroundColor: white,
		inactiveBackgroundColor: white,
		style: {
			//height: Platform.OS === 'android' ? 60 : 50,
      backgroundColor: white,
      borderTopWidth: 0,
      elevation: 5,
      shadowOpacity: 0.2,
      shadowColor: gray
		},
    iconStyle: {
      width: 35,
      height: 30
    },
    indicatorStyle: {
      display: 'none'
    }
	}
})

export default MapNav
