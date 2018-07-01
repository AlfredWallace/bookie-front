export default {
    namespaced: true,
    state: {
        bets: null,
    },
    mutations: {
        setBets(state, data) {
            state.bets = data;
        },
    },
};