import Vue from "vue";

export default {
    namespaced: true,
    state: {
        users: null,
    },
    mutations: {
        setUsers (state, data) {
            state.users = data;
        }
    },
    actions: {
        fetchUsers (context) {
            Vue.axios.get(context.rootState.apiBaseUrl + '/users-bets-stats', {
                headers: {
                    Authorization: `Bearer ${context.rootState.auth.token}`
                }
            }).then((response) => {
                if (response.hasOwnProperty('data')) {
                    context.commit('setUsers', response.data);
                }
            }).catch(() => {
                Vue.router.push({ name: 'logOut' });
            });
        }
    },
};