import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import Modal from 'react-native-modal'
import { SegmentedControls } from 'react-native-radio-buttons'
import Tags from '../components/Tags'
import { createTrip, createTripWithLocation } from '../network/trips'
import { white, primary, transparentWhite } from '../utils/colors'

const options = ["Only you", "Followers", "Everyone"]

export default class CreateTripPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      tags: [],
      selectedOption: options[0],
      showAlert: false
    }
  }

  componentDidMount() {
    this.props.nav.setParams({ finishNewTrip: this.finishNewTrip })
  }

  handleNameChange = name => {
    if (name) {
      this.setState({
        name,
        showAlert: false
      })
    }
    else {
      this.setState({ name })
    }
  }

  addNewTag = tag => {
    let { tags } = this.state
    if (tag.length === 0 || tags.indexOf(tag) !== -1) {
      return
    }
    this.setState({
      tags: tags.concat(tag)
    })
  }

  removeTag = tag => {
    let { tags } = this.state
    let index = tags.indexOf(tag.title)
    this.setState({
      tags: [...tags.slice(0, index), ...tags.slice(index + 1)]
    })
  }

  setSelectedOption = selectedOption => {
    this.setState({
      selectedOption
    })
  }

  finishNewTrip = () => {
    let { name, tags, selectedOption } = this.state
    if (!name) {
      this.setState({
        showAlert: true
      })
      return
    }
    let { adding, uid, locationId, locationName } = this.props.nav.state.params
    if (!adding) {
      createTrip(uid, name, tags, selectedOption)
      .then(() => {
        this.props.nav.goBack()
      })
    } else {
      createTripWithLocation (
        uid,
        name,
        tags,
        selectedOption,
        locationId,
        locationName
      )
      .then(() => {
        this.props.nav.goBack()
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Enter Trip Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(name) => this.handleNameChange(name)}
        />
        <Text style={this.state.showAlert ? styles.showAlert : styles.hideAlert}>Please enter a name!</Text>
        <Text style={styles.text}>Add Trip Tags (separate by a space):</Text>
        <Tags
          tags={this.state.tags}
          addNewTag={this.addNewTag}
          removeTag={this.removeTag}
        />
        <Text style={styles.text}>Make this trip visible to:</Text>
        <SegmentedControls
          containerStyle={ styles.segmentSelect }
          options={ options }
          onSelection={ this.setSelectedOption.bind(this) }
          selectedOption={ this.state.selectedOption }
          tint={ white }
          backTint={ primary }
          selectedTint={ primary }
          selectedBackgroundColor={ white }
          containerBorderTint={ transparentWhite }
          separatorTint={ transparentWhite }
          separatorWidth={ 1 }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 20,
    flex: 1,
    backgroundColor: primary
  },
  modal: {
    margin: 0,
    width: '100%'
  },
  text: {
    color: white,
    marginTop: 15
  },
  input: {
    height: 30,
    borderColor: transparentWhite,
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 5,
    color: white
  },
  segmentSelect: {
    marginTop: 10
  },
  showAlert: {
    color: 'red'
  },
  hideAlert: {
    display: 'none'
  }
})
