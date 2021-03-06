import React from 'react'
import { Platform } from 'react-native'
import { TabNavigator, navigationOptions } from 'react-navigation'
import Dimensions from 'Dimensions'
import MapPage from '../pages/MapPage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import NotificationPage from '../pages/NotificationPage'
import TripsPage from '../pages/TripsPage'
import { FontAwesome } from '@expo/vector-icons'
import { primary, white, gray } from '../utils/colors'

const MapScreen = (props) => (
	<MapPage {...props.screenProps} navigation={props.navigation} />
)

const TripsScreen = (props) => (
  <TripsPage {...props.screenProps} />
)

const ProfileScreen = (props) => (
	<ProfilePage {...props.screenProps} />
)

const NotificationScreen = (props) => (
  <NotificationPage {...props.screenProps} />
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
    navigationOptions: this.navOpts('Explore', 'map')
	},
	TripPage: {
		screen: props => TripsScreen(props),
		navigationOptions: this.navOpts('Trips', 'list')
	},
  NotificationPage: {
    screen: props => NotificationScreen(props),
    navigationOptions: this.navOpts('Notifications', 'bell')
  },
	ProfilePage: {
		screen: props => ProfileScreen(props),
    navigationOptions: this.navOpts('Profile', 'user')
	},
}
, {
	animationEnabled: true,
  tabBarPosition: 'bottom',
	tabBarOptions: {
    //showLabel: Platform.OS === 'android' ? false : true,
		activeTintColor: primary,
    inactiveTintColor: gray,
		showIcon: true,
		activeBackgroundColor: white,
		inactiveBackgroundColor: white,
		style: {
      backgroundColor: white,
      borderTopWidth: 0,
      elevation: 5,
      shadowOpacity: 0.2,
      shadowColor: gray
		},
    tabStyle: {
      padding: 0,
      margin: 0
    },
    iconStyle: {
      width: 35,
      height: 30,
      marginBottom: 0,
      paddingBottom: 0
    },
    labelStyle: {
      fontSize: 10,
      paddingTop: 0
    },
    indicatorStyle: {
      display: 'none'
    }
	}
})

export default MapNav
