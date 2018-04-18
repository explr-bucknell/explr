*Javascript Files*

<table>
  <tr>
  <th>File</th>
  <th>Description</th>
  </tr>
  <tr>
  <td colspan="2"><i>explr/LoginScreens</i></td>
  </tr>
  <tr>
  <td> button.js</td>
  <td> Contains the button class and style sheet used in this section</td>
  </tr>
  <tr>
  <td> logo.js</td>
  <td> Contains the logo class and style sheet</td>
  </tr>
  <tr>
  <td colspan="2"><i>explr/LoginScreens/Login</i></td>  
  </tr>
  <tr>
  <td> ForgotPwd.js</td>
  <td> Contains function to send a password reset email, leading to the reset password page</td>
  </tr>
  <tr>
  <td> ResetPwd.js</td>
  <td> Contains the page and functionality for the user to reset their password</td>  
  </tr>
  <tr>
  <td> loginForm.js</td>
  <td> Contains the default login page layout and function, including redirects to other pages</td>  
  </tr>
  <tr>
  <td> loginLogo.js</td>
  <td> Contains the login logo and relevant style sheet</td>  
  </tr>
  <tr>
  <td> loginOther.js</td>
  <td> Contains the redirect for Facebook and Gmail sign in</td>  
  </tr>
  <tr>
  <td colspan="2"><i>explr/LoginScreens/Signup</i></td>  
  </tr>
  <tr>
  <td> signupConfirm.js</td>
  <td> Contains the page to redirect users to their email for sign up confirmation</td>
  </tr>
  <tr>
  <td> signupDone.js</td>
  <td> Contains the sign up completion page</td>
  </tr>
  <tr>
  <td> signupEmail.js</td>
  <td> Contains functions to check email validity and uniqueness</td>
  </tr>
  <tr>
  <td> signupHandle.je</td>
  <td> Contains functions to check handles validity and uniqueness</td>
  </tr>
  <tr>
  <td> signupName.js</td>
  <td> Contains the page to input your name</td>
  </tr>
  <tr>
  <td> signupPwd.js</td>
  <td> Contains the page to input your password as well as password strength verification</td>
  </tr>
  <tr>
  <td colspan="2"><i>explr/components</i></td>
  </tr>
  <tr>
  <td> CategoryFilter.js</td>
  <td> Component to allow a user to select filters that limit the types of POIs shown on the map</td>
  </tr>
  <tr>
  <td> ContentGrid.js</td>
  <td> Component to format a grid, used in displaying user's favorited locations</td>
  </tr>
  <tr>
  <td> CustomPinSearch.js</td>
  <td> Component to allow users to add their own POIs to the Firebase database, and functions to verify that the POIs exist in Google Places API to ensure validity</td>
  </tr>
  <tr>
  <td> MapMarkerCallout.js</td>
  <td> Component to display a preview of the POI's information and image upon pin selection</td>
  </tr>
  <tr>
  <td> NewTagModal.js</td>
  <td> <b>INFO REQUIRED</b></td>
  </tr>
  <tr>
  <td> SavedLocations.js</td>
  <td> Component utilizing the content grid for saved locations</td>
  </tr>
  <tr>
  <td> SearchFilterContainer.js</td>
  <td> Component to house search filtered search results</td>
  </tr>
  <tr>
  <td> SearchFilterOption.js</td>
  <td> <b>INFO REQUIRED</b></td>
  </tr>
  <tr>
  <td> SearchPlaces.js</td>
  <td> Component to handle searching</td>
  </tr>
  <tr>
  <td> SearchTags.js</td>
  <td> Component to handle the tag search feature</td>
  </tr>
  <tr>
  <td> SearchUsers.js</td>
  <td> Component to handle the user search feature</td>
  </tr>
  <tr>
  <td> Tag.js</td>
  <td> Component for tags</td>
  </tr>
  <tr>
  <td> Tags.js</td>
  <td> Functions to add and remove tags</td>
  </tr>
  <tr>
  <td> TagsArea.js</td>
  <td> Component for the tags display</td>
  </tr>
  <tr>
  <td> TripContainer.js</td>
  <td> Component used to house trips and associated information</td>
  </tr>
  <tr>
  <td> TripsList.js</td>
  <td> Component to display a trips list</td>
  </tr>
  <tr>
  <td> UserTrips.js</td>
  <td> Contains functions to load trips, add location to trips, and for rendering the prior trip components into one feature</td>
  </tr>
  <tr>
  <td colspan="2"><i>explr/components/Notifications</i></td>
  </tr>
  <tr>
  <td> FollowApproval.js</td>
  <td> <b>INFO REQUIRED</b></td>
  </tr>
  <tr>
  <td> FollowRequest.js</td>
  <td> Contains functions for a user issue a follow request, approve request, and send approval notifications</td>
  </tr>
  <tr>
  <td> JoinTripApproval.js</td>
  <td> Component to display an approval for a join request</td>
  </tr>
  <tr>
  <td> JoinTripRequest.js</td>
  <td> Contains functions to deny requests, approve requests, and send approval notifications</td>
  </tr>
  <tr>
  <td> push_listener.js</td>
  <td> Used to handle notifications received while the app is open or is opened after closing</td>
  </tr>
  <tr>
  <td colspan="2"><i>explr/functions</i></td>
  </tr>
  <tr>
  <td> FirebaseTripCode.js</td>
  <td> Contains the first iteration of functions used to construct trips in Firebase. No longer implemented</td>
  </tr>
  <tr>
  <td> index.js</td>
  <td> Initialize the Firebase configuration.</td>
  </tr>
  <tr>
  <td> location_to_geo.js</td>
  <td> Contains functions to grab points from the Firebase database and convert them into geofire points</td>
  </tr>
  <tr>
  <td> nps_poi.js</td>
  <td> Contains the functions to grab information from the national park service and push them to Firebase</td>
  </tr>
  <tr>
  <td> push_code.js</td>
  <td> Contains the function to implement registration for push notifications</td>
  </tr>
  <tr>
  <td colspan="2"><i>explr/navigators <b> needs more info</b></i></td>
  </tr>
  <tr>
  <td> LoginNav.js</td>
  <td> Contains all constants necessary to operator the navigator leaving the login page and going to all singup options, logins, forgot/reset password, and the central page</td>
  </tr>
  <tr>
  <td> MainNav.js</td>
  <td> Contains all constants necessary to operator the central navigator, including the redirects to all main pages, including map, search, profile, trips, following, create trip, location page, tag page, and settings</td>
  </tr>
  <tr>
  <td> MapNav.js</td>
  <td> Contains all constants necessary for naviagtion out of the map page </td>
  </tr>
  <tr>
  <td colspan="2"><i>explr/network</i></td>
  </tr>
  <tr>
  <td> Requests.js</td>
  <td> Contains all functions for interaction with the Firebase database for creating, editing, adding to, and managing trips; also includes the route optimization and route distance calculator</td>
  </tr>
  <tr>
  <td colspan="2"><i>explr/pages</i></td>
  </tr>
  <tr>
  <td> Contains all pages in the app</td>
  <td> This folder contains all javascript files to implement every page in the app. The names of the files are labeled to clearly indicate which page they correlate to. These pages implement all components and functions relevant to operate their individual pages, and also implement their own unique functions for navigation, and unique database calls.</td>
  </tr>
  <tr>
  <td colspan="2"><i>explr/utils</i></td>
  </tr>
  <tr>
  <td> colors.js</td>
  <td> Contains a standardized list of all colors used in the app</td>
  </tr>
  <tr>
  <td> poiTypes.js</td>
  <td> Contains a standardized stylesheet for all poi types used on the map</td>
  </tr>
  <tr>
  <td> tag_utils.js</td>
  <td> <b>INFO REQUIRED</b></td>
  </tr>
  <tr>
  <td colspan="2"><i>explr</i></td>
  </tr>
  <tr>
  <td> .eslintrc.js</td>
  <td> <b>INFO REQUIRED</b></td>
  </tr>
  <tr>
  <td> App.js</td>
  <td> Contains all information required for Expo to build and launch the app</td>
  </tr>
</table>
