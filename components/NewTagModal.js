import React, { Component } from 'react'
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { primary, white } from '../utils/colors'

export default class NewTagModal extends Component {

  constructor(props) {
    super(props)
  }

  state = {
    text: ''
  }

  // Update state when input changes
  onChangeText = (text) => this.setState({ text })

  onSubmit = () => {
    this.props.onCloseModal()
    this.props.onSubmitTag(this.state.text)
  }

  render() {
    const { onCloseModal } = this.props
    return (
      <TouchableWithoutFeedback onPress={onCloseModal}>
        <View style={styles.container}>
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                autoFocus={true}                        // focus and show the keyboard
                keyboardType="twitter"                  // keyboard with no return button
                placeholder="Add a tag..."              // visible before they started typing
                style={styles.input}
                onChangeText={this.onChangeText}        // handle input changes
              />

              <TouchableOpacity
                style={styles.button}
                onPress={this.onSubmit}
              >
                <Text style={this.state.text ? styles.text : [styles.text, styles.inactive]}>Add</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    width: '100%'
  },
  container: {
    flex: 1,                              // take up the whole screen
    justifyContent: 'flex-end',           // position input at the bottom
    backgroundColor: 'rgba(0,0,0,0.33)',  // semi transparent background
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: white,
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: 40,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 20,
  },
  inactive: {
    color: '#CCC',
  },
  text: {
    color: primary,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})
