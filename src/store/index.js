import Vue from "vue";
import Vuex from "vuex";
import Cookie from 'vue-cookie';
import matchModule from './modules/match';
import userModule from './modules/user';
import betModule from './modules/bet';
import router from '../router/index';

Vue.use(Vuex);
Vue.use(Cookie);

export default new Vuex.Store({
    modules: {
        matchModule,
        userModule,
        betModule,
    },
    state: {
        apiBaseUrl: process.env.BOOKIE_API_URL,
        auth: {
            loggedIn: false,
            token: Vue.cookie.get('BEARER'),
            payload: null,
            userId: null,
            isAdmin: false,
        },
    },
    mutations: {
        setAuthData(state, {loggedIn, token, payload, userId, isAdmin}) {
            state.auth = {loggedIn, token, payload, userId, isAdmin};

            // let splitToken = token.split('.');
            // if (splitToken.length === 3) {
            //     let payload = JSON.parse(window.atob(splitToken[1]));
            //     if (payload.hasOwnProperty('exp')) {
            //         let currentTimestamp = (new Date()).getTime() / 1000;
            //         if (currentTimestamp < payload.exp) {
            //             state.auth.loggedIn = true;
            //             state.auth.token = token;
            //             state.auth.payload = payload;
            //             if (payload.hasOwnProperty('userId')) {
            //                 state.auth.userId = payload.userId;
            //             }
            //             if (payload.hasOwnProperty('roles') && payload.roles.hasOwnProperty('ROLE_ADMIN')) {
            //                 state.auth.isAdmin = true;
            //             }
            //         }
            //     }
            // }
        },
        resetAuthData(state) {
            state.auth = {
                loggedIn: false,
                token: null,
                payload: null,
                userId: null,
                isAdmin: false,
            };
        },
    },
    actions: {
        logIn(context, token) {
            let splitToken = token.split('.');
            if (splitToken.length === 3) {
                let payload = JSON.parse(window.atob(splitToken[1]));
                if (payload.hasOwnProperty('exp')) {
                    let currentTimestamp = (new Date()).getTime() / 1000;
                    if (currentTimestamp < payload.exp) {
                        return new Promise((resolve, reject) => {
                            context.commit('setAuthData', {
                                loggedIn: true,
                                token,
                                payload,
                                userId: payload.hasOwnProperty('userId') ? payload.userId : null,
                                isAdmin: payload.hasOwnProperty('roles') && payload.roles.hasOwnProperty('ROLE_ADMIN'),
                            });
                            context.dispatch('fetchData', {url: '/matches', setter: 'matchModule/setMatches'});
                            // context.dispatch('fetchData', {url: '/bets', setter: 'setBets'});
                            // context.dispatch('fetchData', {url: '/users', setter: 'setUsers'});
                            resolve();
                        });
                    }
                }
            }
        },
        fetchData(context, {url, setter}) {
            Vue.axios.get(context.state.apiBaseUrl + url, {
                headers: {
                    Authorization: `Bearer ${context.rootState.auth.token}`,
                },
            }).then((response) => {
                if (response.hasOwnProperty('data')) {
                    context.commit(setter, response.data);
                }
            }).catch(() => {
                router.push({name: 'logOut'});
            });
        },
    },
});