import router from '../../router/index.js'
import { auth } from '../../database/firebase.js'
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
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
    },
    actions: {
        async registration({ dispatch, commit }, { name, email, password }) {
            commit('setLoading', true)
            try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password)
                await updateProfile(user, {
                    displayName: name
                })
                commit('setUser', user)

                localStorage.setItem('token', user.accessToken)

                await dispatch('createBlank', user.uid)

                await router.push('/')
            } catch (err) {
                console.error('Registration error: ', err)
                notify({
                    type: 'error',
                    title: 'Реєстрація',
                    text: err.message,
                })
            } finally {
                commit('setLoading', false)
            }
        },
        async login({ dispatch, commit }, { email, password }) {
            commit('setLoading', true)
            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password)
                localStorage.setItem('token', user.accessToken)
                await commit('setUser', user)
                await dispatch('downloadBlank', user.uid)
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
                await commit('setUser', {})
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
        async checkAuth({ dispatch, commit }) {
            commit('setLoading', true)
            try {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        localStorage.setItem('token', user.accessToken)
                        commit('setUser', user)

                        dispatch('downloadBlank', user.uid)
                    } else {
                        localStorage.removeItem('token')
                        router.push('/auth')
                    }
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
    },
}
