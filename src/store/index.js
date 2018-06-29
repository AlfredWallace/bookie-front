import Vue from "vue";
import Vuex from "vuex";
import Cookie from 'vue-cookie';
import matchModule from './modules/match';
import rankModule from './modules/rank';

Vue.use(Vuex);
Vue.use(Cookie);

export default new Vuex.Store({
    modules: {
        match: matchModule,
        rank: rankModule,
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
        logIn (state, token) {
            let splitToken = token.split('.');
            if (splitToken.length === 3) {
                let payload = JSON.parse(window.atob(splitToken[1]));
                if (payload.hasOwnProperty('exp')) {
                    let currentTimestamp = (new Date()).getTime() / 1000;
                    if (currentTimestamp < payload.exp) {
                        state.auth.loggedIn = true;
                        state.auth.token = token;
                        state.auth.payload = payload;
                        if (payload.hasOwnProperty('userId')) {
                            state.auth.userId = payload.userId;
                        }
                        if (payload.hasOwnProperty('roles') && payload.roles.hasOwnProperty('ROLE_ADMIN')) {
                            state.auth.isAdmin = true;
                        }
                    }
                }
            }
        },
        logOut (state) {
            state.auth = {
                loggedIn: false,
                token: null,
                payload: null,
                userId: null,
                isAdmin: false,
            };
        },
    },
});