import { createStore } from 'vuex'
import loading from './modules/loading.js'
import auth from './modules/auth.js'
import blank from './modules/blank.js'

export default createStore({
    modules: {
        loading,
        auth,
        blank,
    },
})
