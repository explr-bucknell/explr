import React from 'react'
import { View } from 'react-native'
import { Container, Header, Content, Tab, Tabs } from 'native-base';
import { primary, white, gray } from '../utils/colors'
import SearchUsers from '../components/SearchUsers'
import SearchPlaces from '../components/SearchPlaces'
import SearchTags from '../components/SearchTags'

export default class SearchPage extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Container>
        <Tabs contentProps={{ keyboardShouldPersistTaps: 'always' }} initialPage={0} tabContainerStyle={{ height: 45 }} tabBarUnderlineStyle={{backgroundColor: primary, height: 3}}>
          <Tab heading="Places" tabStyle={{backgroundColor: white}} activeTabStyle={{backgroundColor: white}} textStyle={{color: gray, fontSize: 14}} activeTextStyle={{color: primary, fontSize: 15}}>
            <SearchPlaces nav={this.props.nav} />
          </Tab>
          <Tab heading="Users" tabStyle={{backgroundColor: white}} activeTabStyle={{backgroundColor: white}} textStyle={{color: gray, fontSize: 14}} activeTextStyle={{color: primary, fontSize: 15}}>
            <SearchUsers nav={this.props.nav} />
          </Tab>
          <Tab heading="Trips" tabStyle={{backgroundColor: white}} activeTabStyle={{backgroundColor: white}} textStyle={{color: gray, fontSize: 14}} activeTextStyle={{color: primary, fontSize: 15}}>
            <SearchTags nav={this.props.nav} />
          </Tab>
        </Tabs>
      </Container>
		)
	}
}
