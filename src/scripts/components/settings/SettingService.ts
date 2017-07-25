import octicons from "octicons";

const config = {
  apiKey: '<YOUR_API_KEY>',
  databaseURL: '<YOUR_DATABASE_URL>',
  storageBucket: '<YOUR_STORAGE_BUCKET_NAME>'
};

declare var firebase;

firebase.initializeApp(config);

export default class SettingService {
  constructor(){
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // [START_EXCLUDE]
        let toggleIcon:string = octicons['issue-opened'].toSVG();
        $('#gxFirebaseLinkStatus').html()
        document.getElementById('quickstart-button').textContent = 'Sign out';
        document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
        document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        // [END_EXCLUDE]
      } else {
        // Let's try to get a Google auth token programmatically.
        // [START_EXCLUDE]
        document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
        document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
        document.getElementById('quickstart-account-details').textContent = 'null';
        // [END_EXCLUDE]
      }
      document.getElementById('quickstart-button').disabled = false;
    });
    
    document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);

  }
}