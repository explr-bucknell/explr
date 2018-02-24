import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import firebase from 'firebase'
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
		var currUid = firebase.auth().currentUser.uid
		var { uid, type } = this.props.nav.state.params
  	this.setState({ 
  		uid, 
  		type, 
  		currUid,
  		manageFollowing: currUid == uid && type == "following"
  	})
  	this.loadConnections(uid, type, currUid)
  }

  loadConnections = (uid, type, currUid) => {
  	let ref = firebase.database().ref('users/main/' + uid + '/' + type)

  	var self = this
  	
  	ref.once('value', function(snapshot) {
  		if (snapshot.val()) {
  			var connectionIds = Object.keys(snapshot.val())
  			self.loadUserData(connectionIds)
  		}
  	})
  }

  loadUserData = (uids) => {
  	var self = this
  	this.data = []
  	uids.forEach(function(id) {
		  var userRef = firebase.database().ref('users/main/' + id)
		  userRef.once('value', function(snapshot) {
		  	if (snapshot.val()) {
		  		var userData = snapshot.val()
		  		var profile = {}
		  		profile.name = userData.firstname + " " + userData.lastname
		  		profile.handle = userData.handle
		  		if (userData.imageUrl) {
		  			profile.imageUrl = userData.imageUrl
		  		}
		  		self.data = [...self.data, profile]
		  		if (self.data.length == uids.length) {
		  			self.setState({ data: self.data })
		  		}
		  	}
		  })
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
