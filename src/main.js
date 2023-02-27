import {createApp} from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router/index.js'
// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import Notifications from '@kyvg/vue3-notification'
// import 'firebase/auth'
// import 'firebase/database'
import './style.css'

// const firebaseConfig = {
//     apiKey: "AIzaSyBVtKDq0tPl-IZmgrMaGyEs43g7qg6HI-o",
//     authDomain: "rat-race-two.firebaseapp.com",
//     projectId: "rat-race-two",
//     storageBucket: "rat-race-two.appspot.com",
//     messagingSenderId: "713103656721",
//     appId: "1:713103656721:web:635d0837c04491c9f0eeb0",
//     measurementId: "G-Z3KL7XPKLW"
// };
//
// const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);
// onAuthStateChanged(auth, user => {
//     console.log('user: ', user);
// });
const app = createApp(App)
app.use(store)
app.use(router)
app.use(Notifications)
app.mount('#app')
