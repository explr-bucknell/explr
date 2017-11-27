import React from 'react'
import {TouchableOpacity} from 'react-native'
import { StackNavigator, navigationOptions } from 'react-navigation'
import { FontAwesome } from '@expo/vector-icons'
import MapPage from './pages/MapPage'
import { primary, white } from './utils/colors'

const MapScreen = () => (
	<MapPage />
)

const MapNavOpts = {
	headerTitle: "EXPLR",
	headerStyle: { 
		backgroundColor: primary,
		borderBottomWidth: 0,
	},
	headerRight: 
		<TouchableOpacity style={{ marginRight: 10 }}>
			<FontAwesome
		      name='search'
		      size={20}
		      style={{ color: white }}
		    />
		</TouchableOpacity>,
	headerTintColor: white,
	headerBackTitle: null,
}

const MapNav = StackNavigator({
	MapPage: {
		screen: MapScreen,
		navigationOptions: MapNavOpts
	}
})

export default MapNav
