import Vue from "vue";
import Vuex from "vuex";
import matchModule from './modules/match';
import userModule from './modules/user';
import betModule from './modules/bet';
import teamModule from './modules/team';
import authModule from './modules/auth';
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        matchModule,
        userModule,
        betModule,
        teamModule,
        authModule,
    },
    state: {
        apiBaseUrl: process.env.BOOKIE_API_URL,
    },
    // actions: {
    //     fetchData(context, {url, setter}) {
    //         Vue.axios.get(context.state.apiBaseUrl + url, {
    //             headers: {
    //                 Authorization: `Bearer ${context.rootState.auth.token}`,
    //             },
    //         }).then((response) => {
    //             if (response.hasOwnProperty('data')) {
    //                 context.commit(setter, response.data);
    //             }
    //         }).catch(() => {
    //             router.push({name: 'logOut'});
    //         });
    //     },
    // },
});