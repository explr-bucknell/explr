import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { StyleSheet, ScrollView } from 'react-native' // eslint-disable-line no-unused-vars
import SearchFilterOption from './SearchFilterOption' // eslint-disable-line no-unused-vars
import { types } from '../utils/poiTypes'

export default class SearchFilterContainer extends Component {

  constructor () {
    super ()
    this.state = {
      selectedFilters: []
    }
  }

  toggleFilter (filterType) {
    let { selectedFilters } = this.state
    let newFilters = []
    if (selectedFilters.includes (filterType)){
      const index = selectedFilters.indexOf (filterType)
      newFilters = selectedFilters.slice (0, index).concat (selectedFilters.slice (index + 1, selectedFilters.length))
    } else {
      newFilters = selectedFilters.concat ([filterType])
    }
    this.setState ({ selectedFilters: newFilters})
    this.props.updateFilters (newFilters)
  }

  render () {
    let { filters } = this.props
    return (
      <ScrollView horizontal style={styles.filterContainer}>
        {
          Object.keys (filters).map ((filterType, index) =>
            <SearchFilterOption
              key={index}
              color={types[filterType].color}
              filterName={types[filterType].name}
              selected={this.state.selectedFilters.includes (filterType)}
              handleFilterPress={() => this.toggleFilter (filterType)}
              quantity={filters[filterType]}
            />
          )
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create ({
  filterContainer: {
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 250
  }
})
