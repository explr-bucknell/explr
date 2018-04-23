import firebase from 'firebase'
const fetch = require('node-fetch')

export function authStateObserver (signedInCallback, signedOutCallback) {
  authObserver = firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      signedInCallback(user)
    } else {
      // No user is signed in.
      signedOutCallback()
    }
  })
  return authObserver
}

export function getCurrUid () {
  return firebase.auth().currentUser.uid
}

export function getConnections (uid, type, callback) {
  let ref = firebase.database().ref('users/main/' + uid + '/' + type)
  
  ref.on('value', function(snapshot) {
    if (snapshot.val()) {
      var connectionIds = Object.keys(snapshot.val())
      callback(connectionIds)
    }
  })

  return ref
}

export function getHandle (uid, callback) {
  firebase.database().ref('users/handles').orderByValue().equalTo(uid).once('value', function(snapshot) {
    if (snapshot.numChildren()) {
      callback(Object.keys(snapshot.val())[0])
    }
  })
}

export function getConnectionsDetail (uids, callback) {
  var data = []
  uids.forEach(id => {
    var userRef = firebase.database().ref('users/main/' + id)
    userRef.once('value', function(snapshot) {
      if (snapshot.val()) {
        var userData = snapshot.val()
        var profile = {}
        profile.uid = id
        profile.name = userData.firstname + " " + userData.lastname
        profile.handle = userData.handle
        if (userData.imageUrl) {
          var gsReference = firebase.storage().ref(userData.imageUrl)
          gsReference.getDownloadURL().then(function(imageUrl) {
            profile.imageUrl = imageUrl
            data = [...data, profile]

            if (data.length == uids.length) {
              callback(data)
            }
          })
        } else {
          data = [...data, profile]
          if (data.length == uids.length) {
            callback(data)
          }
        }
      }
    })
  })
}

export function getUserProfile (uid, callback) {
  var userRef = firebase.database().ref(`users/main/${uid}`)

  userRef.on('value', function(snapshot) {
    callback(snapshot.val())
  })

  return userRef
}

export function getProfilePic (url, callback) {
  var gsReference = firebase.storage().ref(url)
  gsReference.getDownloadURL().then(function(imageUrl) {
    callback(imageUrl)
  })
}

export function uploadNewProfilePic (base64, uid) {
  var url = 'https://us-central1-senior-design-explr.cloudfunctions.net/profileImageUpload'
  fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid: uid,
      base64: base64
    })
  })
}

export async function checkHandleDuplicate (handle) {
  var handlesRef = firebase.database().ref('users/handles')
  var duplicate
  await handlesRef.child(handle).once("value", function(snapshot) {
    if (snapshot.val()) {
      duplicate = true
    } else {
      duplicate = false
    }
  })
  return duplicate
}

export function updateHandle (uid, newHandle, oldHandle) {
  handleRef = firebase.database().ref('users/handles')
  handleRef.child(oldHandle).remove()
  handleRef.child(newHandle).set(uid)
}

export function updateUserProfile (uid, updates, callback) {
  var userRef = firebase.database().ref(`users/main/${uid}`)
  userRef.update({ ...updates }).then(() => {
    callback()
  })
}

export function getUserFollowStatus (currUid, uid, callback) {
  var ref = firebase.database().ref('users/main/' + currUid + '/following')
  ref.orderByKey().equalTo(uid).on('value', function(snapshot) {
    if (snapshot.numChildren()) {
      callback(currUid, true)
    }
    else {
      callback(currUid, false)
    }
  })
  return ref
}
