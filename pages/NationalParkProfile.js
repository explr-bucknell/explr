import React from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title } from "native-base"
import firebase from 'firebase'
import { primary, white, gray, black } from '../utils/colors'
import ContentGrid from '../components/ContentGrid'
import SavedLocations from '../components/SavedLocations'
import SavedChallenges from '../components/SavedChallenges'

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const IMAGE_HEIGHT = 150;
const HEADER_HEIGHT = 50;
const SCROLL_HEIGHT = IMAGE_HEIGHT;
const THEME_COLOR = "rgba(85,186,255, 1)";
const FADED_THEME_COLOR = "rgba(85,186,255, 0.8)";

export default class NatParkProf extends React.Component {
  scroll = new Animated.Value(0);
  textColor = primary;
  tabBg = white;
  tabY = this.scroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
    outputRange: [0, 0, 1]
  });
  headerBg = 'transparent';
  
  
  tabContent = (x, i) => <View>
    <List>
      {new Array(x).fill(null).map((x, i) => <Item key={i}><Text>Item {i}</Text></Item>)}
    </List></View>;

  constructor(props) {
    super(props);
  }

  state = {
    uid: null,
    displayName: null,
    handle: null,
    numFollowers: null,
    numFollowing: null,
    imageUrl: null
  }
  /*
  componentWillMount() {
    this.setState({
      uid: this.props.uid ? this.props.uid : this.props.nav.state.params.uid
    })
  }
  */

  componentDidMount() {
    var self = this
    const url = 'users/main/' + this.state.uid
    var userRef = firebase.database().ref(url)
  }
  
  render() {
    console.log(this.state)
    return (
        <View style={{backgroundColor: white}}>
          <Animated.ScrollView
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.scroll}}}], {useNativeDriver: true})}
            style={{zIndex: 0}}>
          
              <View style={styles.header}>
                <View style={styles.textContainer}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.name}>{this.props.nav.state.params.name}</Text>
                    <Text style={styles.handle}>{this.props.nav.state.params.description}</Text>
                  </View>
                </View>
                <View style={styles.profileContainer}>
                  <View style={styles.profilePicHolder}>
                    <Image style={styles.profilePic} source={{ uri: this.props.nav.state.params.imageUrl }} />
                  </View>
                </View>
              </View>

              <Tabs
                renderTabBar={(props) => 
                  <Animated.View
                    style={{transform: [{translateY: this.tabY}], zIndex: 1, width: "100%", backgroundColor: white}}>
                    <ScrollableTab {...props}
                      style={{borderBottomWidth: 0}}
                      renderTab={(name, page, active, onPress, onLayout) => (
                        <TouchableOpacity 
                          key={page}
                          onPress={() => onPress(page)}
                          onLayout={onLayout}
                          activeOpacity={0.4}>
                          <TabHeading 
                            scrollable
                            style={{
                              backgroundColor: "transparent",
                              width: SCREEN_WIDTH / 2,
                              borderBottomWidth: 0
                            }}
                            active={active}>
                            <Text style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontWeight: "bold",
                              color: active ? this.textColor : gray,
                              fontSize: active ? 16 : 15
                            }}>
                              {name}
                            </Text>
                          </TabHeading>
                        </TouchableOpacity>
                      )}
                      underlineStyle={{backgroundColor: this.textColor, borderWidth: 0}}
                    />
                  </Animated.View>
                }
              >
            <Tab heading="Reviews">
              <View />
            </Tab>
            <Tab heading="Gallery">
              <View />
            </Tab>
          </Tabs>
        </Animated.ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 0,
    backgroundColor: white
  },
  profileContainer: {
    flex: 1,
  },
  profilePicHolder: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderColor: gray,
    borderWidth: 0,
    marginBottom: 40
  },
  profilePic: {
    flex: 1,
    width: 0,
    height: 0,
    borderRadius: 39,
    borderWidth: 0
  },
  textContainer: {
    flex: 2.5,
  },
  nameContainer: {
    flexDirection: 'column'
  },
  name: {
    marginTop: 5,
    fontSize: 22,
    color: black,
    fontWeight: 'bold'
  },
  handle: {
    marginTop: 10,
    fontSize: 15,
    color: gray,
    fontWeight: 'bold'
  },
  followContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  followers: {
    flex: 1,
    marginRight: 30
  },
  following: {
    flex: 1,
    marginRight: 30
  },
  followValue: {
    fontSize: 15,
    color: black,
    fontWeight: 'bold'
  },
  followLabel: {
    fontSize: 15,
    color: gray,
    fontWeight: 'bold'
  }
});

