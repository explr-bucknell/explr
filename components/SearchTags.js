import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { primary, white, gray, black } from '../utils/colors'
import { getTrendTags, getTags } from '../network/trips'

export default class SearchTags extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tagOrder: [],
      tags: {}
    }
  }

  componentDidMount() {
    this.props.nav.setParams({ handleTagSearch: this.handleTextChange })
    getTrendTags(this.showTrends)
  }

  showTrends = (tags, tagOrder) => {
    this.setState({ tags, tagOrder })
  }

  handleTextChange = (text) => {
    if (!text) {
      getTrendTags(this.showTrends)
      return
    }
    text = text.toLowerCase()
    getTags(text, this.showTrends)
  }

  render() {
    const { tags, tagOrder, expanded } = this.state
    return (
      <ScrollView style={styles.container}>
        {tagOrder.map((tag, i) => (
          <TouchableOpacity key={i} style={styles.profileCard} onPress={() => this.props.nav.navigate('TagPage', {tag: tag})}>
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
