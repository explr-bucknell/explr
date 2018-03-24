import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import firebase from 'firebase'
import { primary, white, gray, black } from '../utils/colors'

export default class SearchTags extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    tagOrder: [],
    tags: {},
    expanded: null
  }

  componentDidMount() {
    this.props.nav.setParams({ handleTagSearch: this.handleTextChange })
    this.showTrends()
  }

  showTrends = () => {
    var self = this
    var ref = firebase.database().ref('tags')
    ref.orderByChild('count').limitToLast(100).on('value', function(snapshot) {
      var tags = {}
      var tagOrder = []
      snapshot.forEach(function(tag) {
        var tagName = tag.key
        var tagVal = tag.val()
        tags[tagName] = tagVal
        tagOrder.push(tagName)
      })
      tagOrder.sort((a, b) => (tags[a].count > tags[b].count ? -1 : 1))
      self.setState({ tags, tagOrder })
    })
  }

  handleTextChange = (text) => {
    if (!text) {
      this.showTrends()
      return
    }
    text = text.toLowerCase()
    var self = this
    var ref = firebase.database().ref('tags')
    ref.orderByKey().startAt(text).endAt(text + '\uf8ff').limitToFirst(100).on('value', function(snapshot) {
      var tags = {}
      var tagOrder = []
      snapshot.forEach(function(tag) {
        var tagName = tag.key
        var tagVal = tag.val()
        tags[tagName] = tagVal
        tagOrder.push(tagName)
      })
      tagOrder.sort((a, b) => (tags[a].count > tags[b].count ? -1 : 1))
      self.setState({ tags, tagOrder })
    })
  }

  handleExpandCollapse = tag => {
    if (this.state.expanded === tag) {
      this.setState({
        expanded: null
      })
    }
    else {
      this.setState({
        expanded: tag
      })
    }
  }

  render() {
    const { tags, tagOrder, expanded } = this.state
    return (
      <ScrollView style={styles.container}>
        {tagOrder.map((tag, i) => (
          <TouchableOpacity key={i} style={styles.profileCard} onPress={() => {this.handleExpandCollapse(tag)}}>
            <View style={styles.textWrapper}>
              <Text style={styles.name}>{'#' + tag}</Text>
              <Text style={styles.handle}>{tags[tag].count + ' trips total'}</Text>
            </View>
            <Ionicons name={expanded === tag ? 'ios-arrow-down' : 'ios-arrow-forward'} size={25} style={styles.icon} />
          </TouchableOpacity>
          /* TODO: Load trip data when expanded */
        ))}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: white,
    paddingLeft: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textWrapper: {
    margin: 10
  },
  name: {
    marginTop: 5,
    color: black,
    fontSize: 16,
    fontWeight: 'bold'
  },
  handle: {
    marginTop: 2,
    color: gray,
    fontSize: 14
  },
  icon: {
    color: gray,
    marginRight: 15
  }
})
