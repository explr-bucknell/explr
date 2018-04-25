import firebase from 'firebase'
const fetch = require('node-fetch')

const FOLLOW_ENDPOINT = 'https:///us-central1-senior-design-explr.cloudfunctions.net/sendFollowNotification/'

export function getUserNotifications (uid, callback) {
  var ref = firebase.database().ref('users/notifications/' + uid)
  ref.on('value', function(snapshot) {
    if (snapshot.val()) {
      callback(snapshot.val())
    } else {
      callback([])
    }
  })
  return ref
}

export function deleteNotification (uid, notificationId) {
  var ref = firebase.database().ref(`users/notifications/${uid}/${notificationId}`)
  ref.remove()
}

export function sendFollowRequest (uid, currUid) {
  var ref = firebase.database().ref('users/notifications/' + uid)
  ref.orderByChild('data/sender').equalTo(currUid).once('value', function(snapshot) {
    if (snapshot.numChildren() === 0) {
      newFollowRequest(uid, currUid)
    }
  })
}

function newFollowRequest (uid, currUid) {
  var ref = firebase.database().ref('users/notifications/')
  var newKey = ref.child(uid).push().key
  var newRequest = {}
  newRequest[newKey + '/data/sender'] = currUid
  newRequest[newKey + '/time'] = (new Date).getTime()
  newRequest[newKey + '/type'] = 'FOLLOW_REQUEST'
  ref.child(uid).update(newRequest).then(function() {
    console.log("follow request sent")
  })
  fetch(FOLLOW_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({
      requester:currUid, //sending the follow request
      requestee:uid //who the request is being sent to
    }),
  })
}

export function stopFollowing (uid, currUid) {
  var ref = firebase.database().ref('users/main/' + currUid)
  var followingRef = firebase.database().ref('users/main/' + uid)
  ref.child('numFollowing').transaction(function(numFollowing) {
    return numFollowing - 1
  })
  followingRef.child('numFollowers').transaction(function(numFollowers) {
    return numFollowers - 1
  })
  ref.child('following/' + uid).remove()
  followingRef.child('followers/' + currUid).remove()
}

export function sendJoinTripRequest (creatorId, currUid, tripId) {
  var ref = firebase.database().ref('users/notifications/' + creatorId)
  ref.orderByChild('data/requester').equalTo(currUid).once('value', function(snapshot) {
    if (snapshot.numChildren() == 0) {
      newJoinTripRequest(creatorId, currUid, tripId)
    }
    else {
      var data = snapshot.val()
      var found = false
      for (let item of Object.keys(data)) {
        if (data[item].data.tripId === tripId) {
          found = true
          break
        }
      }
      if (!found) {
        newJoinTripRequest(creatorId, currUid, tripId)
      }
    }
  })
}

function newJoinTripRequest (creatorId, currUid, tripId) {
  var ref = firebase.database().ref('users/notifications/')
  var newKey = ref.child(creatorId).push().key
  var newRequest = {}
  newRequest[newKey + '/data/requester'] = currUid
  newRequest[newKey + '/data/tripId'] = tripId
  newRequest[newKey + '/time'] = Date.now()
  newRequest[newKey + '/type'] = 'JOIN_TRIP_REQUEST'
  ref.child(creatorId).update(newRequest).then(function() {
    console.log("join trip request sent")
  })
}

export function unjoinTrip (currUid, tripId) {
  firebase.database().ref(`users/main/${currUid}/joinedTrips`).child(tripId).remove()
  firebase.database().ref(`trips/${tripId}/participants`).child(currUid).remove()
}
