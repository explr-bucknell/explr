import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button, Animated } from 'react-native'
import SearchFilterContainer from './SearchFilterContainer'
import SearchOption from './SearchOption'
import { FontAwesome, Ionicons } from '@expo/vector-icons'

class CustomPinSearchContainer extends React.Component {
  state = {
    yPos: new Animated.Value(-200)
  }

  componentDidMount () {
    Animated.timing(
      this.state.yPos,
      {
        toValue: 0,
        duration: 500
      }
    ).start()
  }

  componentWillUnmount () {
    Animated.timing(
      this.state.yPos,
      {
        toValue: -200,
        duration: 500
      }
    ).start()
  }

  render () {
    let { yPos } = this.state
    return (
      <Animated.View
        style={{
          width: '100%',
          height: 250,
          position: 'absolute',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          bottom: 0,
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}

export default class CustomPinSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      customPinSearchResults: [],
      selectedFilters: [],
      selectedOption: 'blah'
    }
  }

  componentWillMount () {
    this.setState({
      customPinSearchResults: this.props.customPinSearchResults
    })
  }

  componentWillReceiveProps (props) {
    this.setState({
      customPinSearchResults: props.customPinSearchResults,
    })
  }

  handleOptionSelect(poi) {
    this.setState({
      selectedOption: poi.name
    })
    this.props.handleOptionSelect(poi)
  }

  render () {
    return (
      <CustomPinSearchContainer style={styles.customPinSearchContainer}>
        <SearchFilterContainer
          filters={this.props.types}
          updateFilters={(selectedFilters) => this.props.updateSelectedFilters(selectedFilters)}
        />
        <View style={styles.customPinBanner}>
          <TouchableOpacity
            onPress={() => this.props.onCancel()}>
      			<Ionicons
      		      name='md-close'
      		      size={25}
      		      style={{ color: 'white', marginLeft: 15, marginTop: 3 }}
      		    />
      		</TouchableOpacity>
          <Text style={{color: 'white', fontSize: 20}}>Points of Interest</Text>
          <TouchableOpacity
            onPress={() => {this.state.selectedOption != 'blah' && this.props.poiSubmit()}}>
      			<Ionicons
    		      name='md-checkmark'
    		      size={25}
    		      style={{ color: 'white', marginRight: 15, marginTop: 3 }}
    		    />
      		</TouchableOpacity>
        </View>
        <ScrollView style={styles.resultsContainer}>
          { this.state.customPinSearchResults.map((poi, index) =>
            <SearchOption
              handlePOISelect={() => this.handleOptionSelect(poi)}
              selected={poi.name === this.state.selectedOption ? true : false}
              key={index}
              name={poi.name}
            />
          )}
          { this.state.customPinSearchResults.length === 0 &&
            <View style={{width: '100%', alignItems: 'center', paddingTop: 10}}>
              <Text>No results found</Text>
            </View>
          }
        </ScrollView>
      </CustomPinSearchContainer>
    )
  }
}

const styles = StyleSheet.create({
  customPinBanner: {
    width: '100%',
    height: 50,
    backgroundColor: 'lightblue',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  resultsContainer: {
    width: '100%',
    height: 200,
  },
  poiContainer: {
    width: '100%',
    height: 50,
    borderColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingLeft: 20,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  filterContainer: {
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 250
  }
})
