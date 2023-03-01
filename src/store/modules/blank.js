import { notify } from '@kyvg/vue3-notification'
import { INITIAL_BLANK } from '../../database/variables.js'
import { doc, setDoc, addDoc, collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../database/firebase.js";

export default {
    state: {
        blank: null,
    },
    mutations: {
        setBlank(state, blank) {
            state.blank = blank
        },
    },
    actions: {
        async createBlank({ commit, state }, userUid, blankName = 'blank') {
            commit('setLoading', true)
            try {
                const blankCollection = collection(db, `${userUid}`);
                const documentCollection = doc(blankCollection, `${blankName}`)
                await setDoc(documentCollection, {
                    ...INITIAL_BLANK,
                    ...{
                        userUid,
                        blankName,
                        createdAt: new Date(),
                    }
                });

                const documentSnap = await getDoc(documentCollection);
                documentSnap.exists() && commit('setBlank', documentSnap.data())
            } catch (err) {
                console.error('Create blank error: ', err)
                notify({
                    type: 'error',
                    title: 'Створення бланка',
                    text: err.message,
                })
            } finally {
                commit('setLoading', false)
            }
        },
        async uploadBlank({ commit }, blank) {
            commit('setLoading', true)
            try {
                const blankCollection = collection(db, `${blank.userUid}`);
                const documentCollection = doc(blankCollection, `${blank.blankName}`)
                await setDoc(documentCollection, {
                    ...blank,
                    ...{
                        updatedAt: new Date(),
                    }
                });

                const documentSnap = await getDoc(documentCollection);
                documentSnap.exists() && commit('setBlank', documentSnap.data())

                notify({
                    type: 'success',
                    title: 'Збереження даних',
                    text: 'Ваші дані збережені',
                    duration: 1000,
                })

                return true
            } catch (err) {
                console.error('Upload blank error: ', err)
                notify({
                    type: 'error',
                    title: 'Завантаження бланка',
                    text: err.message,
                })
                return false
            } finally {
                commit('setLoading', false)
            }
        },
        async downloadBlank({ commit, state }, userUid) {
            try {
                const myCollectionRef = collection(db, `${userUid}`);
                const querySnapshot = await getDocs(myCollectionRef);

                commit('setBlank', querySnapshot.docs[0].data())
            } catch (err) {
                console.error('Download blank error: ', err)
                notify({
                    type: 'error',
                    title: 'Отримання бланка',
                    text: err.message,
                })
            } finally {
                commit('setLoading', false)
            }
        },
    },
    getters: {
        getBlank(state) {
            return state.blank
        },
    },
}
