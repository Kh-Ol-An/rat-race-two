import router from '../../router/index.js'
import { auth } from '../../../firebase.js'
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { notify } from '@kyvg/vue3-notification'

export default {
    state: {
        user: {},
        isLoading: false,
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setLoading(state, bool) {
            state.isLoading = bool
        },
    },
    actions: {
        async registration({ commit }, { name, email, password }) {
            commit('setLoading', true)
            try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password)
                await updateProfile(user, {
                    displayName: name
                })
                localStorage.setItem('token', user.accessToken)
                commit('setUser', user)
                await router.push('/')
            } catch (err) {
                notify({
                    type: 'error',
                    title: 'Реєстрація',
                    text: err.message,
                })
            } finally {
                commit('setLoading', false)
            }
        },
        async login({ commit }, { email, password }) {
            commit('setLoading', true)
            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password)
                localStorage.setItem('token', user.accessToken)
                commit('setUser', user)
                await router.push('/')
            } catch (err) {
                notify({
                    type: 'error',
                    title: 'Вхід',
                    text: err.message,
                })
            } finally {
                commit('setLoading', false)
            }
        },
        async logout({ commit }) {
            commit('setLoading', true)
            try {
                await signOut(auth)
                localStorage.removeItem('token')
                commit('setUser', {})
                await router.push('/auth')
            } catch (err) {
                notify({
                    type: 'error',
                    title: 'Вихід',
                    text: err.message,
                })
            } finally {
                commit('setLoading', false)
            }
        },
        async checkAuth({ commit }) {
            commit('setLoading', true)
            try {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        localStorage.setItem('token', user.accessToken)
                        return commit('setUser', user)
                    }

                    localStorage.removeItem('token')
                    router.push('/auth')
                });
            } catch (err) {
                localStorage.removeItem('token')
                await router.push('/auth')
                notify({
                    type: 'error',
                    title: 'Авторизація',
                    text: err.message,
                })
            } finally {
                commit('setLoading', false)
            }
        },
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getLoading(state) {
            return state.isLoading
        },
    },
}
