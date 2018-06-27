import { mapState } from 'vuex';
// import { mapMutations } from 'vuex';

export default {
    data () {
        return {
            matches: null,
        };
    },
    computed: mapState(['months', 'days', 'auth']),
    // props: ['apiBaseUrl', 'token', 'userId'],
    created () {
        this.getMatches();
    },
    // methods: {
    //     getMatches () {
    //         let comp = this;
    //         this.axios.get(comp.auth.apiBaseUrl + comp.getMatchRoute, {
    //             headers: {
    //                 Authorization: `Bearer ${comp.auth.token}`
    //             }
    //         }).then((response) => {
    //             if (response.hasOwnProperty('data')) {
    //                 comp.matches = response.data;
    //             }
    //         }).catch(() => {
    //             comp.logOut();
    //         });
    //     },
    //     logOut () {
    //         store.commit('logOut');
    //     }
    // },
};
