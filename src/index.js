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
    { name: 'matchs', path: '/pronostics', component: MatchBetList, },
    { name: 'history', path: '/historique', component: MatchHistoryList, },
    { name: 'ranks', path: '/classement', component: RankList, },
    { name: 'admin', path: '/admin', component: Admin, },
    { name: 'login', path: '/login', component: LoginForm, },
    {
        name: 'logout',
        path: '/logout',
        beforeEnter: (to, from, next) => {
            store.commit('logOut');
            next({ name: 'login' });
        },
    }
];

const router = new VueRouter({
    routes: routes,
    mode: 'history',
});

router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && store.state.auth.loggedIn !== true) {
        next({ name: 'login' });
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
                context.rootState.commit('logOut');
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
            token: null,
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
    actions: {
        logOut (context) {
            context.commit('logOut');
            router.push({ name: 'logout'});
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
