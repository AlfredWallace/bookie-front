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

Vue.component('match-history-list', {
    data: function () {
        return {
            getMatchRoute: '/matches-started-bets'
        };
    },
    mixins: [matchListMixin],
    template: `
        <div class="row bk-header-shift">
            <match-history v-for="match in matches" :match="match" :key="match.id" :months="months" :days="days"
                   :user-id="userId"></match-history>
        </div>
    `
});

let editableMatchMixin = {
    data: function() {
        return {
            homeScore: this.match.home_score,
            awayScore: this.match.away_score,
            loading: false
        };
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
                                <button class="btn btn-lg btn-block" :class="btnColor" :disabled="loading == true"
                                    @click="saveResult">{{ btnSaveLabel }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

let matchMixin = {
    data: function() {
        return {
            flagsUrl: 'https://fsprdcdnpublic.azureedge.net/global-pictures/flags-fwc2018-4/',
        };
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
    }
};

Vue.component('match-bet', {
    mixins: [matchMixin, editableMatchMixin],
    created: function () {
        if (this.match.hasOwnProperty('home_bet')) {
            this.homeScore = this.match.home_bet;
        }
        if (this.match.hasOwnProperty('away_bet')) {
            this.awayScore = this.match.away_bet;
        }
    },
    data: function () {
        return {
            btnSaveLabel: 'Enregistrer mon pari',
            btnColor: 'btn-success'
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

Vue.component('match-history', {
    mixins: [matchMixin],
    methods: {
        compareBets: function (a, b) {
            if (a.points > b.points) {
                return -1;
            } else if (a.points < b.points) {
                return 1;
            } else if (a.user.username > b.user.username) {
                return 1;
            } else if (a.user.username < b.user.username) {
                return -1;
            } else {
                return 0;
            }
        }
    },
    computed: {
        orderedBets: function () {
            return this.match.bets.sort(this.compareBets);
        }
    },
    template: `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card" :class="[ match.is_over ? 'border-secondary' : 'border-success' ]">
                <div class="card-header text-center text-white bk-match-card-header"
                 :class="[ match.is_over ? 'bg-secondary' : 'bg-success' ]">
                    {{ formatedKickOff }}
                </div>
                <div class="card-body text-info bk-match-card-content">
                    <div class="container-fluid">
                        <div class="row align-items-center justify-content-center bk-match-card-content">
                            <div class="col-4">
                                <div class="">
                                    <img class="img-fluid" :src="flagsUrl + match.home_team.abbreviation" />
                                </div>
                                <div class="text-center bk-team-name text-uppercase">
                                    {{ match.home_team.abbreviation }}
                                </div>
                            </div>
                            <div class="col-4 text-center bk-score">
                                <span v-if="match.is_over">{{ match.home_score }} - {{ match.away_score }}</span>
                                <font-awesome-icon icon="futbol" class="fa-lg text-success" v-else></font-awesome-icon>
                            </div>
                            <div class="col-4">
                                <div class="">
                                    <img class="img-fluid" :src="flagsUrl + match.away_team.abbreviation" />
                                </div>
                                <div class="text-center bk-team-name text-uppercase">
                                    {{ match.away_team.abbreviation }}
                                </div> 
                            </div>
                        </div>
                        
                        <div v-if="match.bets.length > 0" class="row bk-bets">
                            <div class="col">
                                <table class="table table-sm text-secondary">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th class="text-right">points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <bet v-for="bet in orderedBets" :bet="bet" :points="bet.points" :key="bet.id"
                                        :user-id="userId" :match="match"></bet>
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
});

Vue.component('bet', {
    data: function () {
        return {
            classObject: {
                'text-success': this.match.is_over && this.bet.points > 0,
                'text-danger': this.match.is_over && this.bet.points === 0,
                'bg-light font-weight-bold': this.userId === this.bet.user.id
            }
        };
    },
    props: ['bet', 'userId', 'match'],
    template:`
        <tr :class="classObject">
            <td>{{ bet.user.username.length > 10 ? bet.user.username.substring(0,7) + '...' : bet.user.username }}</td>
            <td class="text-center">{{ bet.home_score }} - {{ bet.away_score }}</td>
            <td class="text-right">{{ bet.points }}</td>
        </tr>
    `
});

Vue.component('rank-list', {
    data: function () {
        return {
            users: null,
            responsiveDisplay: 'd-none d-sm-inline'
        };
    },
    props: ['apiBaseUrl', 'token', 'userId'],
    template: `
        <div class="bk-header-shift">
            <div class="row">
                <div class="col">
                    <table class="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th>Joueur</th>
                            <th class="text-right">
                                <font-awesome-icon icon="trophy"></font-awesome-icon>
                                <span :class="responsiveDisplay">Points</span>
                            </th>
                            <th class="text-right">
                                <font-awesome-icon icon="receipt"></font-awesome-icon>
                                <span :class="responsiveDisplay">Paris</span>
                            </th>
                            <th class="text-right">
                                <font-awesome-icon icon="check"></font-awesome-icon>
                                <span :class="responsiveDisplay">Gagnés</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <rank v-for="user in users" :user="user" :key="user.id" :user-id="userId"></rank>
                    </tbody>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="jumbotron">
                        <span class="h3">Calcul des points</span>
                        <hr class="display-4">
                        <div class="lead">
                            <span class="h5">Résultat</span>
                            <p>
                                Pour chaque bon résultat (qui remporte le match, ou match nul) pronostiqué, 
                                5 points sont accordés. Pour les matchs de phase finale, seul le temps réglementaire 
                                est pris en compte, c'est à dire sans les prolongations ni les tirs au but.
                            </p>
                            <span class="h5">Écart au score</span>
                            <p>
                                En fonction de l'écart au score, un maximum de 5 points supplémentaires peuvent être 
                                accordés selon la règle suivante : chaque but d'écart entre le pronostic et le résultat
                                enlève 1 point du maximum de 5 possibles.
                            </p>
                            <span class="h5">Exemple</span>
                            <p>
                                Alice parie Russie 3-1 Arabie Saoudite. Le résultat est 5-0 pour la Russie, elle marque
                                donc d'abord 5 points pour avoir trouvé le résultat.Entre son pronostic et le résultat, 
                                il y a 2 buts d'écarts pour la Russie et 1 pour l'Arabie Saoudite, elle marque donc
                                5 - (2 + 1) = 2 points en plus, pour un total de 7.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        getUsers: function() {
            let rankList = this;
            Axios.get(this.apiBaseUrl + '/users-bets-stats', {
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
    data: function () {
        return {
            classObject: {
                'text-info font-weight-bold': this.userId === this.user.id
            }
        };
    },
    props: ['user', 'userId'],
    template: `
        <tr :class="classObject">
            <td>{{ user.username.length > 20 ? user.username.substring(0,17) + '...' : user.username }}</td>
            <td class="text-right">{{ user.points }}</td>
            <td class="text-right">{{ user.nbBets }}</td>
            <td class="text-right">{{ user.nbWins }}</td>
        </tr>
    `
});

Vue.component('admin', {
    data: function () {
        return {
            getMatchRoute: '/matches-started'
        };
    },
    mixins: [matchListMixin],
    template: `
        <div class="row bk-header-shift">
            <match-admin v-for="match in matches" :match="match" :key="match.id" :months="months" :days="days"
                   :user-id="userId" :token="token" :api-base-url="apiBaseUrl"></match-admin>
        </div>
    `
});

Vue.component('match-admin', {
    mixins: [matchMixin, editableMatchMixin],
    data: function () {
        return {
            btnSaveLabel: 'Clôturer le match',
            btnColor: 'btn-danger'
        };
    },
    methods: {
        saveResult: function () {
            let matchComponent = this;
            matchComponent.loading = true;
            Axios.post(this.apiBaseUrl + '/matches/' + matchComponent.match.id + '/end',
                {
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
                    text: 'Match clôturé !'
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
        isAdmin: false,
        responsiveDisplay: 'd-none d-lg-inline'
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
            this.setPageCookie();
        },
        showMatchBetList: function () {
            this.page = 'match-bet-list';
            this.setPageCookie();
        },
        showMatchHistoryList: function () {
            this.page = 'match-history-list';
            this.setPageCookie();
        },
        showAdmin: function () {
            this.page = 'admin';
            this.setPageCookie();
        },
        setPageCookie: function () {
            this.$cookie.set('landing_page', this.page, { expires: 7});
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

                let pageCookie = this.$cookie.get('landing_page');
                if (pageCookie !== null) {
                    this.page = pageCookie;
                } else {
                    this.page = 'match-bet-list';
                    this.setPageCookie();
                }

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
