import firebase from 'firebase';
import 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCENP_b7VcFQQ8uoDqpUQMgAaQSvEQ7trc",
    authDomain: "your-event-239811.firebaseapp.com",
    databaseURL: "https://your-event-239811.firebaseio.com",
    projectId: "your-event-239811",
    storageBucket: "your-event-239811.appspot.com",
    messagingSenderId: "31645358317",
    appId: "1:31645358317:web:0d62e5e123bf7476"
  };

firebase.initializeApp(firebaseConfig);
firebase.firestore();



export default firebase;