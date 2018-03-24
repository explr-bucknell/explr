import React, { PureComponent } from 'react'
import { LayoutAnimation, PanResponder, StyleSheet, View } from 'react-native'
import TagsArea from './TagsArea'

export default class Tags extends PureComponent {

  state = {
    tags: [...new Set(this.props.tags)].map((title: string) => ({ title }))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tags: [...new Set(nextProps.tags)].map((title: string) => ({ title }))
    })
  }

  // Remove tag
  removeTag = tag => {
    this.setState((state) => {
      const index = state.tags.findIndex(({ title }) => title === tag.title)
      return {
        tags: [
          ...state.tags.slice(0, index),
          ...state.tags.slice(index + 1)
        ]
      }
    })
  }

  // Add new tag to the state
  onSubmitNewTag = title => {
    // Remove tag if it already exists to re-add it to the bottom of the list
    const existingTag = this.state.tags.find((tag: TagObject) => tag.title === title)
    if (existingTag) {
      this.removeTag(existingTag)
    }
    // Add new tag to the state
    this.setState((state: State) => {
      return {
        tags: [
          ...state.tags,
          { title }
        ]
      }
    })
  }

  render() {
    const { tags } = this.state
    return (
      <View
        style={styles.container}
      >
        <TagsArea
          tags={tags}
          removeTag={this.props.removeTag}
          addNewTag={this.props.addNewTag}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  }
})
