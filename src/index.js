import Vue from 'vue'
import Axios from 'axios'

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
                           class="form-control form-control-lg">
                </div>
                <div class="form-group">
                    <input type="password" v-model="userPassword" placeholder="Password" :disabled="loading == true"
                           class="form-control form-control-lg">
                </div>
                <div class="d-flex">
                    <button @click="connect" :disabled="loading == true" class="btn btn-info">Se connecter</button>
                    <button @click="createAccount" :disabled="loading == true" class="btn btn-link ml-auto">
                        Créer un compte
                    </button>
                </div>
            </div>
        </div>
    `,
    methods: {
        connect: function() {
            let loginForm = this;
            loginForm.loading = true;
            Axios.post(loginForm.apiBaseUrl + '/login_check', {
                username: this.userLogin,
                password: this.userPassword
            }).then(function(response) {
                if (response.hasOwnProperty('data') && response.data.hasOwnProperty('token')) {
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
                    loginForm.connect();
                }
            }).catch(function () {
                loginForm.loading = false;
            });
        }
    }
});

Vue.component('match-list', {
    data: function() {
        return {
            matches: null,
            months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
            days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
        };
    },
    props: ['apiBaseUrl', 'token', 'userId'],
    template: `
        <div class="row bk-header-shift">
            <match v-for="match in matches" :match="match" :key="match.id" :months="months" :days="days"
                :user-id="userId" :token="token" :api-base-url="apiBaseUrl"></match>
        </div>
    `,
    methods: {
        getMatches: function() {
            let matchList = this;
            Axios.get(this.apiBaseUrl + '/matches', {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(function (response) {
                if (response.hasOwnProperty('data')) {
                    matchList.matches = response.data;
                }
            });
        }
    },
    created: function () {
        this.getMatches();
    }
});

Vue.component('match', {
    data: function() {
        return {
            flagsUrl: 'https://fsprdcdnpublic.azureedge.net/global-pictures/flags-fwc2018-4/',
            homeScore: null,
            awayScore: null
        };
    },
    props: ['match', 'months', 'days', 'userId', 'token', 'apiBaseUrl'],
    methods: {
        saveBet: function () {
            let matchComponent = this;
            Axios.post(
                this.apiBaseUrl + '/bets/group-stage',
                {
                    user: matchComponent.userId,
                    match: matchComponent.match.id,
                    home_score: this.homeScore,
                    away_score: this.awayScore
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });
        }
    },
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
                                    <img class="img-fluid" :src="flagsUrl + match.home_team.abbreviation">
                                </div>
                                <div class="w-25 ml-3 bk-team-name">{{ match.home_team.abbreviation }}</div>
                                <div class="w-25 ml-auto">
                                    <input type="number" class="form-control form-control-lg" placeholder="0" step="1"
                                        v-model="homeScore">
                                </div>
                            </div>
                        </div>
                        <div class="row align-items-center justify-content-center">
                            <div class="col d-flex justify-content-start align-items-center text-uppercase">
                                <div class="w-25">
                                    <img class="img-fluid" :src="flagsUrl + match.away_team.abbreviation">
                                </div>
                                <div class="w-25 ml-3 bk-team-name">{{ match.away_team.abbreviation }}</div>       
                                <div class="w-25 ml-auto">
                                    <input type="number" class="form-control form-control-lg" placeholder="0" step="1"
                                        v-model="awayScore">
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <button class="btn btn-lg btn-block btn-success" 
                                    @click="saveBet">Enregistrer mon pari</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    `
});

new Vue({
    el: '#main-container',
    data: {
        loggedIn: false,
        apiBaseUrl: 'http://local.bookie-api.alfred-wallace.com',
        token: null,
        userId: null
    },
    created: function () {
        this.$on('logged-in', function (token) {
            this.loggedIn = true;
            this.token = token;
            let decodedToken = JSON.parse(window.atob(token.split('.')[1]));
            if (decodedToken.hasOwnProperty('userId')) {
                this.userId = decodedToken.userId;
            } else {
                this.userId = null;
            }
        });
    }
});