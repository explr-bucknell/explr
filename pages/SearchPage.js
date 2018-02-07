import React from 'react'
import { View } from 'react-native'
import { Container, Header, Content, Tab, Tabs } from 'native-base';
import { primary, white, black } from '../utils/colors'
import firebase from 'firebase'
import SearchUsers from './SearchUsers'
import SearchPlaces from './SearchPlaces'

export default class SearchPage extends React.Component {
	constructor(props) {
		super(props)
	}
	/*
	componentDidMount() {
		this.props.nav.setParams({ handleText: this.handleTextChange });
	}

	handleTextChange(text) {
		console.log(text)

		var ref = firebase.database().ref('users/main')
		ref.orderByChild("handle").startAt(text).endAt(text + '\uf8ff').on("child_added", function(snapshot) {
		  	console.log(snapshot.key);
		});


	}
	*/
	render() {
		return (
			<Container>
        <Tabs contentProps={{ keyboardShouldPersistTaps: 'always' }} initialPage={0} tabBarUnderlineStyle={{backgroundColor: primary, height: 3}}>
          <Tab heading="Places" tabStyle={{backgroundColor: white}} textStyle={{color: black, fontSize: 15}} activeTextStyle={{color: primary, fontSize: 16}}>
            <SearchPlaces nav={this.props.nav}/>
          </Tab>
          <Tab heading="Users" tabStyle={{backgroundColor: white}} textStyle={{color: black, fontSize: 15}} activeTextStyle={{color: primary, fontSize: 16}}>
            <SearchUsers nav={this.props.nav}/>
          </Tab>
          <Tab heading="Contents" tabStyle={{backgroundColor: white}} textStyle={{color: black, fontSize: 15}} activeTextStyle={{color: primary, fontSize: 16}}>
            <View />
          </Tab>
        </Tabs>
      </Container>
		)
	}
}
