import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Card, CardItem, Switch } from 'native-base'
import firebase from 'firebase'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { primary, white, gray, black, transparentWhite, facebook, twitter, google } from '../utils/colors'

export default class SettingsPage extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    facebook: false,
    twitter: false,
    google: true,
    privateAccount: false,
    pushNotifications: true
  }

  componentDidMount() {
    var nav = this.props.loginNav
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
      } else {
        // No user is signed in.
        nav.navigate('Start')
      }
    })
  }

  userSignOut = () => {
    var nav = this.props.loginNav
    firebase.auth().signOut().then(() => {
      nav.navigate('Start')
    })
  }

  facebookSignin = () => {

  }

  twitterSignin = () => {

  }

  googleSignin = () => {

  }

	render() {
		return (
			<ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOCIAL</Text>
          <TouchableOpacity style={[styles.button, styles.facebook]} onPress={() => this.facebookSignin()}>
            <FontAwesome name='facebook' style={styles.logo}/>
            <Text style={styles.logoLabel}>Facebook</Text>
            { this.state.facebook ? (
              <TouchableOpacity style={styles.socialStatus}>
                <Text style={styles.disabled}>CONNECTED</Text>
                <Ionicons style={styles.disabledIcon} name='ios-checkmark'/>
              </TouchableOpacity> ) : (
              <TouchableOpacity style={styles.socialStatus}>
                <Text style={styles.enabled}>CONNECT</Text>
                <Ionicons style={styles.enabledIcon} name='ios-arrow-forward'/>
              </TouchableOpacity> ) 
            }
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.twitter]} onPress={() => this.twitterSignin()}>
            <FontAwesome name='twitter' style={styles.logo}/>
            <Text style={styles.logoLabel}>Twitter</Text>
            { this.state.twitter ? (
              <TouchableOpacity style={styles.socialStatus}>
                <Text style={styles.disabled}>CONNECTED</Text>
                <Ionicons style={styles.disabledIcon} name='ios-checkmark'/>
              </TouchableOpacity> ) : (
              <TouchableOpacity style={styles.socialStatus}>
                <Text style={styles.enabled}>CONNECT</Text>
                <Ionicons style={styles.enabledIcon} name='ios-arrow-forward'/>
              </TouchableOpacity> ) 
            }
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.google]} onPress={() => this.googleSignin()}>
            <FontAwesome name='google' style={styles.logo}/>
            <Text style={styles.logoLabel}>Google</Text>
            { this.state.google ? (
              <TouchableOpacity style={styles.socialStatus}>
                <Text style={styles.disabled}>CONNECTED</Text>
                <Ionicons style={styles.disabledIcon} name='ios-checkmark'/>
              </TouchableOpacity> ) : (
              <TouchableOpacity style={styles.socialStatus}>
                <Text style={styles.enabled}>CONNECT</Text>
                <Ionicons style={styles.enabledIcon} name='ios-arrow-forward'/>
              </TouchableOpacity> ) 
            }
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
          <Card>
            <CardItem style={styles.row}>
              <Text style={styles.rowText}>Edit Profile</Text>
              <TouchableOpacity onPress={() => this.props.navigate('ProfileEditPage', {uid: this.props.uid})}>
                <Ionicons style={styles.icon} name='ios-arrow-forward'/>
              </TouchableOpacity>
            </CardItem>
            <CardItem style={styles.row}>
              <Text style={styles.rowText}>Change Password</Text>
              <TouchableOpacity onPress={() => this.props.navigate('ChangePwdPage', {uid: this.props.uid})}>
                <Ionicons style={styles.icon} name='ios-arrow-forward'/>
              </TouchableOpacity>
            </CardItem>
            <CardItem style={styles.row}>
              <Text style={styles.rowText}>Private Account</Text>
              <Switch value={this.state.privateAccount} onValueChange={(value) => this.setState({ privateAccount: value })} onTintColor={primary}/>
            </CardItem>
            <CardItem style={styles.row}>
              <Text style={styles.rowText}>Push Notifications</Text>
              <Switch value={this.state.pushNotifications} onValueChange={(value) => this.setState({ pushNotifications: value })} onTintColor={primary}/>
            </CardItem>
          </Card>
          <Card style={{ marginTop: 10 }}>
            <CardItem style={styles.row}>
              <Text style={styles.rowText}>Sign out</Text>
              <TouchableOpacity onPress={() => this.userSignOut()}>
                <FontAwesome name='sign-out' style={styles.signoutIcon}/>
              </TouchableOpacity>
            </CardItem>
          </Card>
        </View>
      </ScrollView>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 12,
    color: gray,
    fontWeight: 'bold',
    marginBottom: 5
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  facebook: {
    backgroundColor: facebook,
  },
  twitter: {
    backgroundColor: twitter,
  },
  google: {
    backgroundColor: google,
  },
  logo: {
    flex: 1,
    color: white,
    fontSize: 20,
    marginLeft: 15
  },
  logoLabel: {
    flex: 5,
    color: white,
    fontSize: 14,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'left'
  },
  socialStatus: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 15
  },
  disabled: {
    color: transparentWhite,
    fontSize: 11,
    fontWeight: 'bold'
  },
  enabled: {
    color: white,
    fontSize: 11,
    fontWeight: 'bold'
  },
  disabledIcon: {
    color: transparentWhite,
    fontSize: 30,
    marginLeft: 5
  },
  enabledIcon: {
    color: white,
    fontSize: 20,
    marginLeft: 10
  },
  row: {
    flexDirection: 'row'
  },
  rowText: {
    flex: 2,
    color: black,
    fontSize: 15
  },
  iconWrapper: {
    flex: 1
  },
  icon: {
    color: gray,
    fontSize: 20,
    textAlign: 'right'
  },
  signoutIcon: {
    color: primary,
    fontSize: 22,
    textAlign: 'right',
    marginTop: 2,
    marginBottom: 2
  }
})
