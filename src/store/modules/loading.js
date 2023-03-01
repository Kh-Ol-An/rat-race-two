export default {
    state: {
        isLoading: false,
    },
    mutations: {
        setLoading(state, bool) {
            state.isLoading = bool
        },
    },
    getters: {
        getLoading(state) {
            return state.isLoading
        },
    },
}
