import Vue from "vue";
import VueRouter from "vue-router";
import Cookie from 'vue-cookie';
import store from "../store/index";

import MatchBetList from '../components/MatchBetList';
import MatchHistoryList from '../components/MatchHistoryList';
import RankList from '../components/RankList';
import Admin from '../components/Admin';
import LoginForm from '../components/LoginForm';

Vue.use(VueRouter);
Vue.use(Cookie);

const routes = [
    { name: 'bets', path: '/pronostics', component: MatchBetList, },
    { name: 'history', path: '/historique', component: MatchHistoryList, },
    { name: 'ranks', path: '/classement', component: RankList, },
    { name: 'admin', path: '/admin', component: Admin, },
    { name: 'logIn', path: '/login', component: LoginForm, },
    {
        name: 'logOut',
        path: '/logout',
        beforeEnter (to, from, next) {
            store.commit('logOut');
            Vue.cookie.delete('BEARER');
            next({ name: 'logIn' });
        },
    },
    {
        name: 'default',
        path: '/',
        beforeEnter (to, from, next) {
            next({ name: 'bets' });
        },
    },
];

const router =  new VueRouter({
    routes,
    mode: 'history',
});

router.beforeEach((to, from, next) => {
    if (store.state.auth.loggedIn !== true && store.state.auth.token === null && to.name !== 'logIn') {
        next({ name: 'logIn' });
    }
    next();
});

export default router;