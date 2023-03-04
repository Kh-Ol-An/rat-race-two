import router from '../../router/index.js'
import {auth, db} from '../../database/firebase.js'
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { notify } from '@kyvg/vue3-notification'
import {collection, getDocs} from "firebase/firestore";

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
        async providerAuth({ dispatch, commit }, type = 'google') {
            commit('setLoading', true)
            try {
                const provider = type === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider()
                console.log(type)
                console.log(provider)
                const { user } = await signInWithPopup(auth, provider)
                console.log(user)
                commit('setUser', user)

                localStorage.setItem('token', user.accessToken)

                const userUid = user.uid
                const blankCollection = collection(db, `${userUid}`)
                const documentSnap = await getDocs(blankCollection)
                documentSnap.empty ? await dispatch('createBlank', userUid) : await dispatch('downloadBlank', userUid)

                await router.push('/')
            } catch (err) {
                console.error('Google Auth error: ', err)
                notify({
                    type: 'error',
                    title: 'Google авторизація',
                    text: err.message,
                })
            } finally {
                commit('setLoading', false)
            }
        },
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
