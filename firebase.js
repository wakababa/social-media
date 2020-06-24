import firebase from "firebase";
var firebaseConfig = {
    apiKey: "AIzaSyCgHJvQX7p_2TVotqaZK-lP3qANZDPpnMk",
    authDomain: "twitter-clone-35153.firebaseapp.com",
    databaseURL: "https://twitter-clone-35153.firebaseio.com",
    projectId: "twitter-clone-35153",
    storageBucket: "twitter-clone-35153.appspot.com",
    messagingSenderId: "932788331188",
    appId: "1:932788331188:web:b669aeb6947bf59c2d2de1",
    measurementId: "G-8PXJQVRTSQ"
  };
  const fire = firebase.initializeApp(firebaseConfig);
  export const  dB = fire.firestore();
  export default fire;
