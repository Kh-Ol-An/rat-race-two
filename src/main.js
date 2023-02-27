import {createApp} from 'vue'
import App from './App.vue'
import Notifications from '@kyvg/vue3-notification'
import './style.css'

const app = createApp(App)
app.use(Notifications)
app.mount('#app')
