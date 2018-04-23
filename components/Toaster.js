import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { white } from '../utils/colors'

export const Toaster = props => (
  <View style={styles.toaster}>
    <Text style={{color: 'red', fontSize: 16}}>{props.text}</Text>
  </View>
)

const styles = StyleSheet.create({
  toaster: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
    borderRadius: 5
  }
})

export default Toaster
