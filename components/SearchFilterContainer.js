import React, { Component } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import SearchFilterOption from './SearchFilterOption'

export default class SearchFilterContainer extends Component {

  constructor () {
    super ()
    this.state = {
      filterOptions: {
        park: {
          color: 'green',
          name: 'Parks'
        },
        museum: {
          color: 'blue',
          name: 'Museums'
        },
        amusement_park: {
          color: 'purple',
          name: 'Amusement Parks'
        },
        aquarium: {
          color: 'lightblue',
          name: 'Aquariums'
        },
        art_gallery: {
          color: 'red',
          name: 'Art Galleries'
        },
        bar: {
          color: 'brown',
          name: 'Bars'
        },
        campground: {
          color: '#b22222',
          name: 'Campgrounds'
        },
        library: {
          color: 'yellow',
          name: 'Library'
        },
        movie_theater: {
          color: '#a30b0b',
          name: 'Movie Theaters'
        },
        restaurant: {
          color: '#d36a02',
          name: 'Restaurants'
        },
        stadium: {
          color: 'silver',
          name: 'Stadiums'
        },
        zoo: {
          color: 'black',
          name: 'Zoos'
        }
      },
      selectedFilter: 'park'
    }
  }

  handleFilterPress (selectedFilter) {
    if (this.state.selectedFilter != selectedFilter) {
      this.setState({ selectedFilter })
      this.props.handleFilterPress(selectedFilter)
    }
  }

  render () {
    return (
      <ScrollView horizontal style={styles.filterContainer}>
        {
          Object.keys(this.state.filterOptions).map((categoryName, index) =>
            <SearchFilterOption
              color={this.state.filterOptions[categoryName].color}
              filterName={this.state.filterOptions[categoryName].name}
              key={index}
              selected={categoryName === this.state.selectedFilter ? true : false}
              handleFilterPress={() => this.handleFilterPress(categoryName)}
            />
          )
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  filterContainer: {
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 250
  }
})
