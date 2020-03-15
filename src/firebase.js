import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD6HuKcvDm2tvw6svqbg6y4A9mYfUHVf8A",
    authDomain: "rms-project-35b1e.firebaseapp.com",
    databaseURL: "https://rms-project-35b1e.firebaseio.com",
    projectId: "rms-project-35b1e",
    storageBucket: "rms-project-35b1e.appspot.com",
    messagingSenderId: "1032194007458",
    appId: "1:1032194007458:web:f10deffb863cbf7dd712fb" 
};
// initialize firebase
firebase.initializeApp(firebaseConfig);

export default firebase;