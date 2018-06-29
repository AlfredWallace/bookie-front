import Vue from 'vue';
import App from './App';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Notifications from 'vue-notification';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import './scss/bookie.scss';
// import Vuex from 'vuex';
// import VueRouter from 'vue-router';
// import Cookie from 'vue-cookie';

fontawesome.library.add(solid);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Notifications);
Vue.use(VueAxios, axios);
// Vue.use(Cookie);
// Vue.use(VueRouter);
// Vue.use(Vuex);

import store from './store/index';
import router from './router/index';

router.beforeEach((to, from, next) => {
    if (store.state.auth.loggedIn !== true && store.state.auth.token === null && to.name !== 'logIn') {
        next({ name: 'logIn' });
    }
    next();
});

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
});
