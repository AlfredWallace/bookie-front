import Vue from 'vue';
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

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
});
