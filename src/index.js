import Vue from 'vue'
import Axios from 'axios'
import Notifications from 'vue-notification'
import Cookie from 'vue-cookie'
import './scss/bookie.scss';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(solid);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.component('login-form', {
    data: function() {
        return {
            userLogin:'',
            userPassword:'',
            loading: false
        };
    },
    props: ['apiBaseUrl'],
    template: `
        <div id="login_form" class="row h-100 align-items-center justify-content-around">
            <div class="col-md-6 col-lg-4">
                <div class="form-group">
                    <input type="text" v-model="userLogin" placeholder="Username" :disabled="loading == true"
                           class="form-control form-control-lg" @keyup.enter="connectPlayer">
                </div>
                <div class="form-group">
                    <input type="password" v-model="userPassword" placeholder="Password" :disabled="loading == true"
                           class="form-control form-control-lg" @keyup.enter="connectPlayer">
                </div>
                <div class="d-flex">
                    <button @click="connectPlayer" :disabled="loading == true" class="btn btn-info">
                        Se connecter
                    </button>
                    <button @click="createAccount" :disabled="loading == true" class="btn btn-link ml-auto">
                        Créer un compte
                    </button>
                </div>
            </div>
        </div>
    `,
    methods: {
        connectPlayer: function() {
            let loginForm = this;
            loginForm.loading = true;
            Axios.post(loginForm.apiBaseUrl + '/login_check', {
                username: this.userLogin,
                password: this.userPassword
            }).then(function(response) {
                if (response.hasOwnProperty('data') && response.data.hasOwnProperty('token')) {
                    loginForm.$cookie.set('BEARER', response.data.token, { expires: 7});
                    loginForm.$root.$emit('logged-in', response.data.token);
                }
            }).catch(function () {
                loginForm.loading = false;
            });
        },
        createAccount: function () {
            let loginForm = this;
            loginForm.loading = true;
            Axios.post(loginForm.apiBaseUrl + '/users/new', {
                username: this.userLogin,
                password: this.userPassword
            }).then(function (response) {
                if (response.hasOwnProperty('data') && response.data.hasOwnProperty('id')) {
                    loginForm.connectPlayer();
                }
            }).catch(function () {
                loginForm.loading = false;
            });
        }
    }
});

let matchListMixin = {
    data: function() {
        return {
            matches: null,
            months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
            days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
        };
    },
    props: ['apiBaseUrl', 'token', 'userId'],
    created: function () {
        this.getMatches();
    },
    methods: {
        getMatches: function() {
            let matchList = this;
            Axios.get(this.apiBaseUrl + this.getMatchRoute, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(function (response) {
                if (response.hasOwnProperty('data')) {
                    matchList.matches = response.data;
                }
            }).catch(function () {
                matchList.$root.$emit('logged-out');
            });
        }
    }
};

Vue.component('match-bet-list', {
    data: function () {
        return {
            getMatchRoute: '/matches-bets/' + this.userId
        };
    },
    mixins: [matchListMixin],
    template: `
        <div class="row bk-header-shift">
            <match-bet v-for="match in matches" :match="match" :key="match.id" :months="months" :days="days"
                :user-id="userId" :token="token" :api-base-url="apiBaseUrl"></match-bet>
        </div>
    `
});

let matchMixin = {
    data: function() {
        return {
            flagsUrl: 'https://fsprdcdnpublic.azureedge.net/global-pictures/flags-fwc2018-4/',
            homeScore: null,
            awayScore: null,
            loading: false
        };
    },
    created: function () {
        if (this.match.hasOwnProperty('home_bet')) {
            this.homeScore = this.match.home_bet;
        }
        if (this.match.hasOwnProperty('away_bet')) {
            this.awayScore = this.match.away_bet;
        }
    },
    props: ['match', 'months', 'days', 'userId', 'token', 'apiBaseUrl'],
    computed: {
        formatedKickOff: function () {
            let kickOffDate = new Date(this.match.kick_off);
            let date = kickOffDate.getDate();
            let dateText = date === 1 ? date + 'er' : date;
            let day = this.days[kickOffDate.getDay()];
            let month = this.months[kickOffDate.getMonth()];
            let minutes = kickOffDate.getMinutes() < 10 ? '0' + kickOffDate.getMinutes() : kickOffDate.getMinutes();
            let hours = kickOffDate.getHours() < 10 ? '0' + kickOffDate.getHours() : kickOffDate.getHours();
            return day + ' ' + dateText + ' ' + month + ' à ' + hours + 'h' + minutes;
        }
    },
    template: `
         <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card border-info">
                <div class="card-header text-center text-white bg-info bk-match-card-header">
                    {{ formatedKickOff }}
                </div>
                <div class="card-body text-info bk-match-card-content">
                    <div class="container-fluid">
                        <div class="row align-items-center justify-content-center">
                            <div class="col d-flex justify-content-start align-items-center text-uppercase">
                                <div class="w-25">
                                    <img class="img-fluid" :src="flagsUrl + match.home_team.abbreviation" />
                                </div>
                                <div class="w-25 ml-3 bk-team-name">{{ match.home_team.abbreviation }}</div>
                                <div class="w-25 ml-auto">
                                    <input type="number" class="form-control form-control-lg" placeholder="0" step="1"
                                        v-model="homeScore" :readonly="loading == true">
                                </div>
                            </div>
                        </div>
                        <div class="row align-items-center justify-content-center">
                            <div class="col d-flex justify-content-start align-items-center text-uppercase">
                                <div class="w-25">
                                    <img class="img-fluid" :src="flagsUrl + match.away_team.abbreviation" />
                                </div>
                                <div class="w-25 ml-3 bk-team-name">{{ match.away_team.abbreviation }}</div>       
                                <div class="w-25 ml-auto">
                                    <input type="number" class="form-control form-control-lg" placeholder="0" step="1"
                                        v-model="awayScore" :readonly="loading == true">
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <button class="btn btn-lg btn-block btn-success" :disabled="loading == true"
                                    @click="saveResult">{{ btnSaveLabel }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    `
};

Vue.component('match-bet', {
    mixins: [matchMixin],
    data: function () {
        return {
            btnSaveLabel: 'Enregistrer mon pari'
        };
    },
    methods: {
        saveResult: function () {
            let matchComponent = this;
            matchComponent.loading = true;
            Axios.post(this.apiBaseUrl + '/bets/group-stage',
                {
                    user: matchComponent.userId,
                    match: matchComponent.match.id,
                    home_score: this.homeScore === '' ? 0 : this.homeScore,
                    away_score: this.awayScore === '' ? 0 : this.awayScore
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                }
            ).then(function () {
                matchComponent.loading = false;
                matchComponent.$notify({
                    type: 'success',
                    text: 'Pari sauvegardé !'
                });
            }).catch(function (error) {
                matchComponent.loading = false;
                let errMsg = 'Erreur inconnue !';
                if (error.hasOwnProperty('response')
                    && error.response.hasOwnProperty('data')
                    && error.response.data.hasOwnProperty('message')) {
                    errMsg = error.response.data.message;
                }
                matchComponent.$notify({
                    type: 'error',
                    text: errMsg
                });
            });
        }
    }
});

Vue.component('rank-list', {
    data: function () {
        return {
            users: null
        };
    },
    props: ['apiBaseUrl', 'token', 'userId'],
    template: `
        <div class="row bk-header-shift">
            <div class="col">
                <table class="table table-striped table-sm">
                <thead>
                    <tr><th>Joueur</th><th>Points</th></tr>
                </thead>
                <tbody>
                    <rank v-for="user in users" :name="user.username" :points="user.points" :key="user.id"></rank>
                </tbody>
                </table>
            </div>
        </div>
    `,
    methods: {
        getUsers: function() {
            let rankList = this;
            Axios.get(this.apiBaseUrl + '/users', {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(function (response) {
                if (response.hasOwnProperty('data')) {
                    rankList.users = response.data;
                }
            }).catch(function () {
                rankList.$root.$emit('logged-out');
            });
        }
    },
    created: function () {
        this.getUsers();
    }
});

Vue.component('rank', {
    props: ['name', 'points'],
    template: `
        <tr><td>{{ name }}</td><td>{{ points }}</td></tr>
    `
});

Vue.component('admin', {
    props: ['apiBaseUrl', 'token', 'userId'],
    template:`<div class="bk-header-shift">Admin</div>`
});

Vue.use(Notifications);
Vue.use(Cookie);

new Vue({
    el: '#body',
    data: {
        loggedIn: false,
        apiBaseUrl: process.env.BOOKIE_API_URL,
        token: null,
        payload: null,
        userId: null,
        page: null,
        isAdmin: false
    },
    created: function () {
        let token = this.$cookie.get('BEARER');
        if (token !== null) {
            this.logIn(token);
        }
    },
    mounted: function () {
        this.$on('logged-in', function (token) {
            this.logIn(token);
        });
        this.$on('logged-out', function () {
            this.logOut();
        })
    },
    methods: {
        showRankList: function () {
            this.page = 'rank-list';
        },
        showMatchList: function () {
            this.page = 'match-bet-list';
        },
        showAdmin: function () {
            this.page = 'admin';
        },
        isTokenExpired: function () {
            if (this.payload !== null && this.payload.hasOwnProperty('exp')) {
                let currentTimestamp = (new Date()).getTime() / 1000;
                if (this.payload.exp > currentTimestamp) {
                    return false;
                }
            }
            return true;
        },
        logIn: function (token) {
            this.token = token;
            this.payload = JSON.parse(window.atob(this.token.split('.')[1]));
            if (!this.isTokenExpired()) {
                this.loggedIn = true;
                this.page = 'match-list';
                if (this.payload.hasOwnProperty('userId')) {
                    this.userId = this.payload.userId;
                }
                if (this.payload.hasOwnProperty('roles') && this.payload.roles.hasOwnProperty('ROLE_ADMIN')) {
                    this.isAdmin = true;
                }
            }
        },
        logOut: function () {
            this.loggedIn = false;
            this.$cookie.delete('BEARER');
        }
    }
});
