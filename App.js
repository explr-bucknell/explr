import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/EvilIcons';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 40.9549774,
            longitude: -76.8813942,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <View style={styles.toolbar}>
          <Icon name="navicon" size={30} color="white" style={{ paddingLeft: 10 }} />
          <View style={styles.header}>
            <Text style={styles.headerText}>EXPLR</Text>
          </View>
          <Icon name="search" size={30} color="white" style={{ paddingRight: 10 }}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    position: 'absolute',
    top: 20,
    width: '100%',
    height: 40,
    backgroundColor: '#68d6ff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold'
  },
  map: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 0
  }
});
