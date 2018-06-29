import Vue from "vue";

export default {
    namespaced: true,
    state: {
        matches: null,
        flagsUrl: 'https://fsprdcdnpublic.azureedge.net/global-pictures/flags-fwc2018-4/',
        months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    },
    mutations: {
        setMatches (state, data) {
            state.matches = data;
        },
    },
    actions: {
        fetchMatches (context, url) {
            Vue.axios.get(context.rootState.apiBaseUrl + url, {
                headers: {
                    Authorization: `Bearer ${context.rootState.auth.token}`,
                },
            }).then((response) => {
                if (response.hasOwnProperty('data')) {
                    context.commit('setMatches', response.data);
                }
            }).catch(() => {
                Vue.router.push({ name: 'logOut' });
            });
        },
    },
};