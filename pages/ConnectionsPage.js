import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import { getCurrUid, getConnections, getConnectionsDetail } from '../network/users'
import { primary, white, gray, black } from '../utils/colors'

export default class ConnectionsPage extends React.Component {
	constructor(props) {
		super(props)
		data = []
	}

	state = {
		uid: null,
		type: null,
		currUid: null,
		uids: [],
		data: [],
		manageFollowing: false
	}

	componentDidMount() {
		var currUid = getCurrUid()
		var { uid, type } = this.props.nav.state.params
  	this.setState({ 
  		uid, 
  		type, 
  		currUid,
  		manageFollowing: currUid == uid && type == "following"
  	})
  	this.connectionRef = getConnections(uid, type, this.loadUserData)
  }

  componentWillUnmount() {
    this.connectionRef.off('value')
  }

  loadUserData = (uids) => {
    getConnectionsDetail(uids, this.onLoadConnectionsDetailComplete)
  }

  onLoadConnectionsDetailComplete = (data) => {
    this.setState({
      data
    })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: gray,
          marginLeft: "14%"
        }}
      />
    )
  }

	render() {
		return (
			<View style={styles.container}>
			<List style={styles.listView} containerStyle={{ marginTop: 0, borderTopWidth: 0, borderBottomWidth: 0 }}>
	      <FlatList
	        data={this.state.data}
	        renderItem={({ item }) => (
	          <ListItem
	            roundAvatar
	            title={item.name}
	            subtitle={item.handle}
	            avatar={ item.imageUrl ? { uri: item.imageUrl } : (require('../assets/images/profilePic.png')) }
	            containerStyle={{ borderBottomWidth: 0 }}
	            onPress={() => this.props.nav.navigate('ProfilePage', {uid: item.uid})}
	          />
	        )}
	        ItemSeparatorComponent={this.renderSeparator}
	        keyExtractor={ item => item.handle }
	      />
	    </List>
	    </View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: white,
		height: "100%"
	},
	listView: {
		backgroundColor: white,
		marginTop: 0
	}
})
