import React from 'react'
import { TabNavigator, navigationOptions } from 'react-navigation'
import Dimensions from 'Dimensions'
import MapPage from './pages/MapPage'
import MapNav from './MapNav'
import ProfilePage from './ProfilePage'
import { FontAwesome } from '@expo/vector-icons'
import { primary, white, gray } from './utils/colors'

/*
export default class Main extends React.Component {

  render () {
    return (
      <MapPage />
    )
  }
}
*/

const DEVICE_HEIGHT = Dimensions.get('window').height;

const MapScreen = () => (
	<MapNav />
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

const MainNavigator = TabNavigator({
	MapPage: {
		screen: MapScreen,
	},
	ProfilePage: {
		screen: ProfileScreen,
	}
}
, {
	animationEnabled: true,
	tabBarPosition: 'bottom',
	tabBarOptions: {
		activeTintColor: primary,
		showIcon: true,
		activeBackgroundColor: white,
		inactiveBackgroundColor: white,
		style: {
			height: 50,
		}
	}
})

export default MainNavigator
