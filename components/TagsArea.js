import React, { PureComponent } from 'react'
import { TextInput, View } from 'react-native'
import Tag from './Tag'
import type { TagObject } from '../utils/tag_utils'
import { white, transparentWhite } from '../utils/colors'

export default class TagsArea extends PureComponent {

  state = {
    newTag: '',
    tags: this.props.tags
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tags: nextProps.tags
    })
  }

  handleChangeText = text => {
    if (text.slice(-1) === ' ') {
      this.props.addNewTag(text.slice(0, -1).toLowerCase())
      this.setState({ newTag: '' })
    }
    else {
      this.setState({ newTag: text })
    }
  }

  render() {
    const { tags, addNewTag, removeTag } = this.props

    return (
      <View style={styles.container}>
        {tags.map(tag =>
          <Tag
            key={tag.title}
            tag={tag}
            onPress={removeTag}
          />
        )}
        <TextInput 
          autoCapitalize='none'
          value={this.state.newTag}
          placeholder='Add new tag...' 
          onChangeText={this.handleChangeText}
          autoCorrect={false}
          style={styles.add} 
        />
      </View>
    )
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 5,
    borderWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    marginTop: 10,
  },
  add: {
    backgroundColor: 'transparent',
    paddingHorizontal: 5,
    color: white,
    width: '100%'
  }
}
