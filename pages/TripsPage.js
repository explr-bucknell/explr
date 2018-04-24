import React from 'react'
import { View, ScrollView } from 'react-native'
import { Container, Header, Content, Tab, Tabs } from 'native-base';
import { primary, white, gray } from '../utils/colors'
import UserTrips from '../components/UserTrips'
import TripsList from '../components/TripsList'

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { uid, navigate } = this.props
    return (
      <Container>
        <Tabs contentProps={{ keyboardShouldPersistTaps: 'always' }} initialPage={0} tabContainerStyle={{ height: 50, borderBottomColor: white }} tabBarUnderlineStyle={{backgroundColor: primary, height: 3}}>
          <Tab heading="My Trips" tabStyle={{backgroundColor: white}} activeTabStyle={{backgroundColor: white}} textStyle={{color: gray, fontSize: 16}} activeTextStyle={{color: primary, fontSize: 15}}>
            <ScrollView style={{ flex: 1, backgroundColor: white }}>
              <UserTrips uid={uid} navigate={navigate} isMyProfile={true} isFollowing={null} user />
            </ScrollView>
          </Tab>
          <Tab heading="Joined" tabStyle={{backgroundColor: white}} activeTabStyle={{backgroundColor: white}} textStyle={{color: gray, fontSize: 16}} activeTextStyle={{color: primary, fontSize: 15}}>
            <TripsList joined={true} uid={uid} navigate={navigate} />
          </Tab>
          <Tab heading="Following" tabStyle={{backgroundColor: white}} activeTabStyle={{backgroundColor: white}} textStyle={{color: gray, fontSize: 16}} activeTextStyle={{color: primary, fontSize: 15}}>
            <TripsList joined={false} uid={uid} navigate={navigate} />
          </Tab>
        </Tabs>
      </Container>
    )
  }
}
