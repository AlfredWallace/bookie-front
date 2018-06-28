import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './App';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Cookie from 'vue-cookie';
import Notifications from 'vue-notification';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import './scss/bookie.scss';

fontawesome.library.add(solid);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Notifications);
Vue.use(Cookie);
Vue.use(VueAxios, axios);
Vue.use(VueRouter);
Vue.use(Vuex);

import MatchBetList from './components/MatchBetList';
import MatchHistoryList from './components/MatchHistoryList';
import RankList from './components/RankList';
import Admin from './components/Admin';
import LoginForm from './components/LoginForm';

const routes = [
    { name: 'bets', path: '/pronostics', component: MatchBetList, },
    { name: 'history', path: '/historique', component: MatchHistoryList, },
    { name: 'ranks', path: '/classement', component: RankList, },
    { name: 'admin', path: '/admin', component: Admin, },
    { name: 'logIn', path: '/login', component: LoginForm, },
    {
        name: 'logOut',
        path: '/logout',
        beforeEnter: (to, from, next) => {
            store.commit('logOut');
            Vue.cookie.delete('BEARER');
            next({ name: 'logIn' });
        },
    }
];

const router = new VueRouter({
    routes,
    mode: 'history',
});

router.beforeEach((to, from, next) => {
    if (store.state.auth.loggedIn !== true && store.state.auth.token === null && to.name !== 'logIn') {
        next({ name: 'logIn' });
    }
    next();
});

const matchModule = {
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
                router.push({ name: 'logOut' });
            });
        },
    },
};

const store = new Vuex.Store({
    modules: {
        match: matchModule,
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

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
});
