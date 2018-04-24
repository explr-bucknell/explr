import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Container, Content, Card, CardItem, Right, Switch } from 'native-base'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { primary, white, gray, black, transparentWhite, facebook, twitter, google } from '../utils/colors'
import { authStateObserver, signOut } from '../network/users'

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
    this.authObserver = authStateObserver(() => null, this.onSignOutDetected)
  }

  componentWillUnmount() {
    this.authObserver()
  }

  onSignOutDetected = () => {
    var nav = this.props.nav.state.params.loginNav
    this.authObserver()
    nav.navigate('Start')
  }

  userSignOut = () => {
    var nav = this.props.nav.state.params.loginNav
    signOut()
  }

  facebookSignin = () => {
    /*
    console.log('facebook')
    var self = this
    let auth = firebase.auth()
    let provider = new firebase.auth.FacebookAuthProvider()
    auth.currentUser.linkWithRedirect(provider)
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // Accounts successfully linked.
        var credential = result.credential;
        var user = result.user;
        console.log(credential)
        self.setState({
          facebook: true
        })
      }
    }).catch(function(error) {
      // Handle Errors here.
      console.log('Facebook linking failed', error)
    });
    */
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
          <Card style={styles.card}>
            <CardItem style={styles.row}>
              <Text style={styles.rowText}>Edit Profile</Text>
              <Right>
                <TouchableOpacity onPress={() => this.props.nav.navigate('ProfileEditPage', {uid: this.props.nav.state.params.uid, refreshProfile: this.props.nav.state.params.refreshProfile})}>
                  <Ionicons style={styles.icon} name='ios-arrow-forward'/>
                </TouchableOpacity>
              </Right>
            </CardItem>
            <CardItem style={styles.row}>
              <Text style={styles.rowText}>Change Password</Text>
              <Right>
                <TouchableOpacity onPress={() => this.props.nav.navigate('ChangePwdPage', {uid: this.props.nav.state.params.uid})}>
                  <Ionicons style={styles.icon} name='ios-arrow-forward'/>
                </TouchableOpacity>
              </Right>
            </CardItem>
            <CardItem style={styles.row}>
              <Text style={styles.rowText}>Private Account</Text>
              <Right>
                <Switch value={this.state.privateAccount} onValueChange={(value) => this.setState({ privateAccount: value })} onTintColor={primary}/>
              </Right>
            </CardItem>
            <CardItem style={styles.row}>
              <Text style={styles.rowText}>Push Notifications</Text>
              <Right>
                <Switch value={this.state.pushNotifications} onValueChange={(value) => this.setState({ pushNotifications: value })} onTintColor={primary}/>
              </Right>
            </CardItem>
          </Card>
          <Card style={[styles.card, {marginTop: 10}]}>
            <CardItem style={styles.row}>
              <Text style={styles.rowText}>Sign out</Text>
              <Right>
                <TouchableOpacity onPress={() => this.userSignOut()}>
                  <FontAwesome name='sign-out' style={styles.signoutIcon}/>
                </TouchableOpacity>
              </Right>
            </CardItem>
          </Card>
        </View>
      </ScrollView>
		)
	}
}

const styles = StyleSheet.create({
  container: {
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
  card: {
    flexWrap: 'nowrap',
    paddingTop: 5,
    paddingBottom: 5
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
    fontSize: 20
  },
  signoutIcon: {
    color: primary,
    fontSize: 22
  }
})
