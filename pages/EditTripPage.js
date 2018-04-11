import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import Modal from 'react-native-modal'
import { SegmentedControls } from 'react-native-radio-buttons'
import Tags from '../components/Tags'
import { editTrip } from '../network/Requests'
import { white, primary, transparentWhite } from '../utils/colors'

const options = ["Only you", "Followers", "Everyone"]

export default class EditTripPage extends Component {
  constructor(props) {
    super(props)
  }

  oldTags = this.props.nav.state.params.tags
  tripId = this.props.nav.state.params.tripId

  state = {
    name: this.props.nav.state.params.name,
    tags: this.props.nav.state.params.tags,
    selectedOption: this.props.nav.state.params.perm,
    showAlert: false
  }

  componentDidMount() {
    this.props.nav.setParams({ finishEditTrip: this.finishEditTrip })
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

  finishEditTrip = () => {
    let { name, tags, selectedOption } = this.state
    if (!name) {
      this.setState({
        showAlert: true
      })
      return
    }
    editTrip(
      this.tripId, 
      name, 
      tags, 
      selectedOption, 
      this.oldTags
    ).then(() => {
      this.props.nav.goBack()
    })
  }

  render() {
    let { name, tags, selectedOption, showAlert } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Edit Trip Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(name) => this.handleNameChange(name)}
        />
        <Text style={showAlert ? styles.showAlert : styles.hideAlert}>Please enter a name!</Text>
        <Text style={styles.text}>Edit Trip Tags (separate by a space):</Text>
        <Tags
          tags={tags}
          addNewTag={this.addNewTag}
          removeTag={this.removeTag}
        />
        <Text style={styles.text}>Make this trip visible to:</Text>
        <SegmentedControls
          containerStyle={ styles.segmentSelect }
          options={ options }
          onSelection={ this.setSelectedOption.bind(this) }
          selectedOption={ selectedOption }
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
