export default {
    namespaced: true,
    state: {
        teams: null,
    },
    mutations: {
        setTeams(state, data) {
            state.teams = data;
        },
    },
};