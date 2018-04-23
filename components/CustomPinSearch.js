import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import {
  StyleSheet,
  Text, // eslint-disable-line no-unused-vars
  View, // eslint-disable-line no-unused-vars
  ScrollView, // eslint-disable-line no-unused-vars
  TouchableOpacity, // eslint-disable-line no-unused-vars
} from 'react-native'
import SearchFilterContainer from './SearchFilterContainer' // eslint-disable-line no-unused-vars
import SearchOption from './SearchOption' // eslint-disable-line no-unused-vars
import Toaster from './Toaster'
import { Ionicons } from '@expo/vector-icons' // eslint-disable-line no-unused-vars
import { white } from '../utils/colors'

// Component allowing users to add their own POIs to our database, as long as they exist on Google's Places API
export default class CustomPinSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      customPinSearchResults: [],
      selectedFilters: [],
      selectedOption: ''
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
      <View style={styles.customPinSearchContainer}>
        {this.props.errorDisplaying &&
          <View style={styles.toaster}>
            <Toaster text='That location already exists in our database!'/>
          </View>
        }
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
            onPress={() => { this.state.selectedOption != '' && this.props.poiSubmit() }}>
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  customPinSearchContainer: {
    width: '100%',
    height: 250,
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    bottom: 0,
  },
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
  toaster: {
    position: 'absolute',
    width: '100%',
    bottom: 300,
  }
})
