import firebase from 'firebase'

export function createTrip (uid, tripName, tripTags, permission) {
  var tripId = firebase.database().ref(`trips/`).push().key // eslint-disable-line

  tripTags.forEach(tag => {
    firebase.database().ref(`tags/${tag}/trips`).update({
      [tripId]: Date.now()
    })
    firebase.database().ref(`tags/${tag}/count`).transaction(function(count) {
      count = count ? count + 1 : 1
      return count
    })
  })

  return firebase.database().ref(`trips/${tripId}`).update({
    name: tripName,
    tags: tripTags,
    permission: permission,
    numLocs: 0,
    creator: uid,
    locations: {}
  })
}

export function createTripWithLocation (uid, tripName, tripTags, permission, locationId, locationName) {
  var tripId = firebase.database().ref(`trips/`).push().key // eslint-disable-line

  tripTags.forEach(tag => {
    firebase.database().ref(`tags/${tag}/trips`).update({
      [tripId]: Date.now()
    })
    firebase.database().ref(`tags/${tag}/count`).transaction(function(count) {
      count = count ? count + 1 : 1
      return count
    })
  })

  return firebase.database().ref(`trips/${tripId}`).update({
    name: tripName,
    tags: tripTags,
    permission: permission,
    numLocs: 1,
    creator: uid,
    locations: {
      [locationId]: {
        visited: false,
        name: locationName,
        index: 0
      }
    }
  })
}

export function editTrip (tripId, name, tags, permission, oldTags) {
  tags.forEach(tag => {
    if (oldTags.indexOf(tag) === -1) {
      firebase.database().ref(`tags/${tag}/trips`).update({
        [tripId]: Date.now()
      })
      firebase.database().ref(`tags/${tag}/count`).transaction(function(count) {
        count = count ? count + 1 : 1
        return count
      })
    }
  })

  oldTags.forEach(tag => {
    if (tags.indexOf(tag) === -1) {
      firebase.database().ref(`tags/${tag}/trips/${tripId}`).set(null)
      firebase.database().ref(`tags/${tag}/count`).transaction(function(count) {
        if (count > 1) {
          return count - 1
        }
        return null
      })
    }
  })

  return firebase.database().ref(`trips/${tripId}/`).update({
    name: name,
    tags: tags,
    permission: permission
  })
}

export function deleteTrip (tripId) {
  firebase.database().ref(`trips/${tripId}`).once('value', function(snapshot) {
    if (snapshot.numChildren()) {
      var trip = snapshot.val()
      var followers = trip.followers ? Object.keys(trip.followers) : []
      var participants = trip.participants ? Object.keys(trip.participants) : []
      var tags = trip.tags ? trip.tags : []

      followers.forEach(follower => {
        firebase.database().ref(`users/main/${follower}/followedTrips/${tripId}`).set(null)
      })

      participants.forEach(participant => {
        firebase.database().ref(`users/main/${participant}/joinedTrips/${tripId}`).set(null)
      })

      tags.forEach(tag => {
        firebase.database().ref(`tags/${tag}/trips/${tripId}`).set(null)
        firebase.database().ref(`tags/${tag}/count`).transaction(function(count) {
          if (count > 1) {
            return count - 1
          }
          return null
        })
      })

      firebase.database().ref(`trips/${tripId}`).set(null)
    }
  })
}

export function getTrips (uid, callback) {
  let ref = firebase.database().ref('trips/')
  ref.orderByChild('creator').equalTo(uid).on('value', function(snapshot) {
    if (snapshot.numChildren()) {
      callback(snapshot.val())
    }
  })
  return ref
}

export function getJoinedOrFollowedTrips (uid, type, callback) {
  var path = `users/main/${uid}/`
  if (type) {
    path += 'joinedTrips'
  } else {
    path += 'followedTrips'
  }
  var ref = firebase.database().ref(path)
  ref.orderByValue().on('value', function(snapshot) {
    if (snapshot.numChildren()) {
      var tripIds = Object.keys(snapshot.val()).reverse()
      var trips = []
      tripIds.forEach(tripId => {
        firebase.database().ref(`trips/${tripId}`).once('value', function(snapshot2) {
          if (snapshot2.numChildren) {
            var trip = snapshot2.val()
            trip.tripId = tripId
            trips.push (trip)
            if (trips.length === tripIds.length) {
              callback(trips)
            }
          }
        })
      })
    }
  })
  return ref
}

export function getTrip (tripId, callback) {
  var ref = firebase.database().ref(`trips/${tripId}`)
  ref.on('value', function(snapshot) {
    if (snapshot.numChildren()) {
      callback(snapshot.val())
    }
  })
  return ref
}

//Add a new location to a trip
export async function addLocationToTrip (tripId, locationId, locationName) {
  var exist = false
  await firebase.database().ref(`trips/${tripId}/locations/${locationId}`).once('value', function(snapshot) {
    if (snapshot.numChildren()) {
      exist = true
    }
  })
  if (exist) {
    return 'failure'
  }

  var numLocations = 0
  await firebase.database().ref(`trips/${tripId}/numLocs/`).transaction(function(numLocs) {
    numLocations = numLocs
    return numLocs + 1
  })

  await firebase.database().ref(`trips/${tripId}/locations/${locationId}`).set({
    visited: false,
    name: locationName,
    index: numLocations
  })
  return 'success'
}

export function getTripsByTag (tag, uid, following, callback) {
  firebase.database().ref(`tags/${tag}/trips`).orderByValue().once('value', function(snapshot) {
    if (snapshot.numChildren()) {
      var tripIds = Object.keys(snapshot.val()).reverse()
      var trips = []
      var count = 0
      tripIds.forEach(tripId => {
        firebase.database().ref(`trips/${tripId}`).once('value', function(snapshot) {
          if (snapshot.numChildren()) {
            var trip = snapshot.val()
            count += 1
            if (trip.creator === uid) {
              // do nothing
            }
            else if (trip.permission === 'Only you') {
              if (count === tripIds.length) {
                callback(trips)
              }
              return
            }
            else if (trip.permission === 'Followers' && following.indexOf(trip.creator) === -1) {
              if (count === tripIds.length) {
                callback(trips)
              }
              return
            }
            trip.tripId = tripId
            trips.push(trip)
            if (count === tripIds.length) {
              callback(trips)
            }
          }
        })
      })
    }
  })
}

export function calculateDistance (trip) {
  var urlStart = ''
  var urlEnd = '&waypoints='
  for (var i = 0; i < trip.length; i++) {
    if (i == 0) {
      urlStart += 'origin=place_id:' + trip[i].locId
    } else if (i == trip.length - 1) {
      urlStart += '&destination=place_id:' + trip[i].locId
    } else {
      urlEnd += 'place_id:' + trip[i].locId + '|'
    }
  }

  var urlWaypoints = urlStart + urlEnd
  var urlFinal = 'https://maps.googleapis.com/maps/api/directions/json?' + urlWaypoints + '&key=AIzaSyBbEBNs_oq5jkeq2rRkSd1mKBkVGX7RjGg'

  return fetch(urlFinal).then(function(response) {
    var googleRet = response.json()
    return googleRet.then((data) => {
      var distance = 0
      var parsed = ''
      for (var i = 0; i < (trip.length - 1); i++) {
        parsed = (data.routes[0].legs[i].distance.text)
        parsed = parseFloat(parsed.replace(',','').replace(' mi',''))
        distance += parsed
      }
      return distance
    })
  })
}

export function optimizeTrip (trip, tripID, callback) {
  var urlStart = ''
  var urlEnd = '&waypoints=optimize:true|'
  for (var i = 0; i < trip.length; i++) {
    if (i == 0) {
      urlStart += 'origin=place_id:' + trip[i].locId
    } else if (i == trip.length - 1) {
      urlStart += '&destination=place_id:' + trip[i].locId
    } else {
      urlEnd += 'place_id:' + trip[i].locId + '|'
    }
  }

  var urlWaypoints = urlStart + urlEnd
  var urlFinal = 'https://maps.googleapis.com/maps/api/directions/json?' + urlWaypoints + '&key=AIzaSyBbEBNs_oq5jkeq2rRkSd1mKBkVGX7RjGg'

  fetch(urlFinal).then(function(response) {
    const googleRet = response.json()
    googleRet.then((data) => {
      var waypointArr = data.routes[0].waypoint_order

      var resArray = []
      for (var i = 0; i < trip.length; i++) {
        if (i != 0 && i != trip.length - 1) {
        resArray.push(trip[waypointArr[i-1]+1])
        } else {
        resArray.push(trip[i])
        }
      }
      recreateTrip(tripID, resArray)
      callback(resArray)
    })
  })

}

export async function recreateTrip (tripId, locationArray) {
  firebase.database().ref(`trips/${tripId}/locations`).once('value', function(snapshot) {
    if (snapshot.numChildren()) {
      var visitedRecords = {}
      Object.keys(snapshot.val()).forEach(locId => {
        visitedRecords[locId] = snapshot.val()[locId].visited
      })
      var updatedLocations = {}
      locationArray.forEach((loc, i) => {
        updatedLocations[loc.locId] = {
          index: i,
          name: loc.name,
          visited: visitedRecords[loc.locId]
        }
      })
      firebase.database().ref(`trips/${tripId}/locations`).set(updatedLocations)
    }
  })
}

export function toggleVisited (tripId, locationId, visited) {
  firebase.database().ref(`trips/${tripId}/locations/${locationId}`).update({
    visited: visited
  })
}

export function getTripLocationsDetail (locations, uid, callback) {
  var set = false
  locations.sort((a, b) => a.index < b.index ? -1 : 1)
  var results = locations.concat()

  var locIds = locations.map(location => location.id)
  var liked
  firebase.database().ref('users/main/' + uid + '/saved').on('value', function(snapshot) {
    if (snapshot.numChildren()) {
      var content = snapshot.val()
      liked = locIds.map(id => (content[id] != null))
    }
    else {
      liked = new Array(locations.length).fill(false)
    }
    results = results.map((location, i) => Object.assign({ liked: liked[i] }, location))
    if (set) {
      callback(results)
    }
    else {
      set = true
    }
  })

  var images = new Array(locations.length).fill(null)
  var count = 0

  locations.forEach((loc, i) => {
    firebase.database().ref(`pois/${loc.id}`).once('value', function(snapshot) {
      var location = snapshot.val()
      images[i] = location.image
      count += 1
      if (count === locations.length) {
        results = results.map((location, i) => Object.assign({ image: images[i] }, location))
        if (set) {
          callback(results)
        }
        else {
          set = true
        }
      }
    })
  })
}

export function getTrendTags (callback) {
  var ref = firebase.database().ref('tags')
  ref.orderByChild('count').limitToLast(100).once('value', function(snapshot) {
    if (snapshot.numChildren()) {
      var tags = {}
      var tagOrder = []
      snapshot.forEach(function(tag) {
        var tagName = tag.key
        var tagVal = tag.val()
        tags[tagName] = tagVal
        tagOrder.push(tagName)
      })
      tagOrder.sort((a, b) => (tags[a].count > tags[b].count ? -1 : 1))
      callback(tags, tagOrder)
    }
  })
}

export function getTags (query, callback) {
  var ref = firebase.database().ref('tags')
  ref.orderByKey().startAt(query).endAt(query + '\uf8ff').limitToFirst(100).on('value', function(snapshot) {
    var tags = {}
    var tagOrder = []
    snapshot.forEach(function(tag) {
      var tagName = tag.key
      var tagVal = tag.val()
      tags[tagName] = tagVal
      tagOrder.push(tagName)
    })
    tagOrder.sort((a, b) => (tags[a].count > tags[b].count ? -1 : 1))
    callback(tags, tagOrder)
  })
}
