export default {
    namespaced: true,
    state: {
        matches: null,
        flagsUrl: 'https://fsprdcdnpublic.azureedge.net/global-pictures/flags-fwc2018-4/',
    },
    mutations: {
        setMatches(state, data) {
            state.matches = data;
        },
    },
};