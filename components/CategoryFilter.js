import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text, // eslint-disable-line no-unused-vars
  Easing,
  Modal,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { primary, white, gray } from '../utils/colors'
import { types } from '../utils/poiTypes'
import SearchFilterOption from './SearchFilterOption'
import { Ionicons } from '@expo/vector-icons'

export default class CategoryFilter extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selectedFilters: [],
      selectingFilters: false,
      types: {}
    }
  }

  componentWillReceiveProps (props) {
    this.setState({ types: props.types })
  }

  toggleFilter (filterType) {
    let { selectedFilters } = this.state
    let newFilters = []
    if (selectedFilters.includes(filterType)){
      const index = selectedFilters.indexOf(filterType)
      newFilters = selectedFilters.slice(0, index).concat(selectedFilters.slice(index + 1, selectedFilters.length))
    } else {
      newFilters = selectedFilters.concat([filterType])
    }
    this.setState({ selectedFilters: newFilters})
    this.props.updateFilters(newFilters)
  }

  render () {
    let { selectingFilters, selectedFilters } = this.state
    return (
      <ScrollView horizontal scrollEnabled={selectingFilters}>
        {selectingFilters &&
          <TouchableOpacity
            style={styles.selectFilterButton}
            onPress={() =>
              this.setState({
                selectingFilters: false
              })
            }
          >
            <Ionicons name='ios-arrow-back' size={20}/>
          </TouchableOpacity>
        }
        <TouchableOpacity
          style={styles.selectFilterButton}
          onPress={() => selectingFilters ?
            this.setState({ selectedFilters: [] }, () => this.props.updateFilters([])) :
            this.setState({selectingFilters: true})}
        >
          {selectingFilters ?
            <Text>Clear Filters</Text> :
            <View style={{paddingLeft: 2, paddingRight: 2}}>
              <Ionicons name='ios-options' size={20}/>
            </View>
          }
        </TouchableOpacity>
        {selectingFilters && Object.keys(this.state.types).map((filterType, index) =>
          <SearchFilterOption
            handleFilterPress={() => this.toggleFilter(filterType)}
            color={types[filterType].color}
            filterName={types[filterType].name}
            key={index}
            selected={selectedFilters.includes(filterType)}
            quantity={this.state.types[filterType]}
          />
        )}
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  filtersContainer: {
    width: '100%',
    height: 50
  },
  selectFilterButton: {
    borderRadius: 7,
    backgroundColor: white,
    padding: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1
  }
})
