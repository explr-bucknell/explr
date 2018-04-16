import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import type { NativeMethodsMixinType } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes'

export default class Tag extends PureComponent {

  tagContainer: ?NativeMethodsMixinType

  // Handle tag taps
  onPress = (): void => {
    this.props.onPress(this.props.tag)
  }

  render() {
    const { tag: { title } } = this.props
    return (
      <View
        ref={el => this.tagContainer = el}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.tag}
          onPress={this.onPress}
        >
          <Icon name="ios-close-circle-outline" size={16} color="#FFF" />
          <Text>{' '}</Text>
          <Text style={styles.title}>{'#' + title}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = {
  tagContainer: {
    marginBottom: 8,
    marginRight: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .33)',
    borderColor: 'rgba(255, 255, 255, .25)',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'normal',
  }
}
