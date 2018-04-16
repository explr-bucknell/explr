import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import {
  StyleSheet,
  View, // eslint-disable-line no-unused-vars
  Text, // eslint-disable-line no-unused-vars
  ScrollView, // eslint-disable-line no-unused-vars
  TouchableOpacity // eslint-disable-line no-unused-vars
} from 'react-native'
import { white, gray } from '../utils/colors'
import { types } from '../utils/poiTypes'
import SearchFilterOption from './SearchFilterOption' // eslint-disable-line no-unused-vars
import { Ionicons } from '@expo/vector-icons' // eslint-disable-line no-unused-vars

// Component that allows users to select filters to limit the POIs showed on the Map
export default class CategoryFilter extends Component {

  constructor (props) {
    super (props)
    this.state = {
      selectedFilters: [],
      selectingFilters: false,
      types: {}
    }
  }

  componentWillReceiveProps (props) {
    this.setState ({ types: props.types })
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
    let { selectedFilters } = this.state
    return (
      <ScrollView horizontal>
        {this.state.selectingFilters &&
          <TouchableOpacity
            style={styles.selectFilterButton}
            onPress={() =>
              this.setState ({
                selectedFilters: [],
                selectingFilters: false
              }, () => this.props.updateFilters ([]))
            }
          >
            <Text>X</Text>
          </TouchableOpacity>
        }
        <TouchableOpacity
          style={styles.selectFilterButton}
          onPress={() => this.state.selectingFilters ?
            this.setState ({ selectedFilters: [] }, () => this.props.updateFilters ([])) :
            this.setState ({selectingFilters: true})}
        >
          {this.state.selectingFilters ?
            <Text>Clear Filters</Text> :
            <View style={{paddingLeft: 2, paddingRight: 2}}>
              <Ionicons name='ios-options' size={20} color={gray}/>
            </View>
          }
        </TouchableOpacity>
        {this.state.selectingFilters && Object.keys (this.state.types).map ((filterType, index) =>
          <SearchFilterOption
            handleFilterPress={() => this.toggleFilter (filterType)}
            color={types[filterType].color}
            filterName={types[filterType].name}
            key={index}
            selected={selectedFilters.includes (filterType)}
            quantity={this.state.types[filterType]}
          />
        )}
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create ({
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
    elevation: 1,
  }
})
