import Vue from 'vue';
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

import MatchBetList from './components/MatchBetList';
import MatchHistoryList from './components/MatchHistoryList';
import RankList from './components/RankList';
import Admin from './components/Admin';


const routes = [
    { path: '/pronostics', component: MatchBetList, },
    { path: '/historique', component: MatchHistoryList, },
    { path: '/classement', component: RankList, },
    { path: '/admin', component: Admin, },
];
const router = new VueRouter({
    routes: routes,
    mode: 'history',
});

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
});
