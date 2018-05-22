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
                    <input type="text" v-model="userLogin" placeholder="Username"
                           class="form-control form-control-lg" :disabled="loading == true">
                </div>
                <div class="form-group">
                    <input type="password" v-model="userPassword" placeholder="Password"
                           class="form-control form-control-lg" :disabled="loading == true">
                </div>
                <button @click="getApiToken" :disabled="loading == true" 
                    class="btn btn-lg btn-info w-100">Login</button>
            </div>
        </div>
    `,
    methods: {
        getApiToken: function() {
            let loginForm = this;
            loginForm.loading = true;
            axios.post(loginForm.apiBaseUrl + '/login_check', {
                username: this.userLogin,
                password: this.userPassword
            }).then(function(response) {
                if (response.hasOwnProperty('data') && response.data.hasOwnProperty('token')) {
                    loginForm.$root.$emit('logged-in', response.data.token);
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
                :user-id="userId"></match>
        </div>
    `,
    methods: {
        getMatches: function() {
            let matchList = this;
            axios.get(this.apiBaseUrl + '/matches', {
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
            flagsUrl: 'https://fsprdcdnpublic.azureedge.net/global-pictures/flags-fwc2018-4/'
        };
    },
    props: ['match', 'months', 'days', 'userId'],
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
                                    <input type="number" class="form-control form-control-lg" placeholder="0" step="1">
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
                                    <input type="number" class="form-control form-control-lg" placeholder="0" step="1">
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <button class="btn btn-lg btn-block btn-success">Enregistrer mon pari</button>
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