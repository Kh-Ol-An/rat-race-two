import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBVtKDq0tPl-IZmgrMaGyEs43g7qg6HI-o",
    authDomain: "rat-race-two.firebaseapp.com",
    projectId: "rat-race-two",
    storageBucket: "rat-race-two.appspot.com",
    messagingSenderId: "713103656721",
    appId: "1:713103656721:web:635d0837c04491c9f0eeb0",
    measurementId: "G-Z3KL7XPKLW"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const analytics = getAnalytics(firebaseApp);

export { firebaseApp, auth, db, analytics };
