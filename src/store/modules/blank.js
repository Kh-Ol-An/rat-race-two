import { notify } from '@kyvg/vue3-notification'
import { INITIAL_BLANK } from '../../database/variables.js'
// import BlankService from '../../services/BlankService.js'

export default {
    state: {
        blank: {},
    },
    mutations: {
        setBlank(state, blank) {
            state.blank = blank
        },
    },
    actions: {
        async uploadBlank({ commit }, blank) {
            console.log('blank: ', blank)
            try {
                // const response = await BlankService.saveBlank(blank)
                // commit('setBlank', response.data.blank)
                notify({
                    type: 'success',
                    title: 'Збереження даних',
                    text: 'Ваші дані збережені',
                    duration: 1000,
                })

                return true
            } catch (err) {
                console.log(err)
                return false
            }
        },
        async downloadBlank({ commit }) {
            try {
                // const response = await BlankService.getBlank()
                // commit('setBlank', response.data)
                commit('setBlank', INITIAL_BLANK)
            } catch (err) {
                console.log(err)
            }
        },
    },
    getters: {
        getBlank(state) {
            return state.blank
        },
    },
}
