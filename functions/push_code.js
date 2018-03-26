import { Permissions, Notifications } from 'expo';
// adapted from https://docs.expo.io/versions/latest/guides/push-notifications.html

const PUSH_ENDPOINT = 'https://us-central1-senior-design-explr.cloudfunctions.net/addPushToken/';

export async function registerForPushNotificationsAsyc(user_id) {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;
  //make sure determined
  if (existingStatus !== 'granted') {
    //for IOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  // no permissions?
  if (finalStatus !== 'granted') {
    return;
  }
  //get token
  let token = await Notifications.getExpoPushTokenAsync();
  //POST
  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({
      token: token,
      uid: user_id
    }),
  });
}
