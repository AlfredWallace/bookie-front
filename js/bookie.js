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
            matches: null
        };
    },
    props: ['apiBaseUrl', 'token'],
    template: `
        <div class="row bk-header-shift">
            <match v-for="match in matches" :match="match" :key="match.id"></match>
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
    props: ['match'],
    template: `
         <div class="col-12 col-lg-6 mb-4">
            <div class="card border-info">
                <div class="card-header text-white bg-info">{{ match.kick_off }}</div>
                <div class="card-body text-info bk-match-card-content">
                    <div class="container-fluid">
                    <div class="row">
                        <div class="col-3">
                            <img class="img-fluid d-flex align-items-center" 
                                :src="flagsUrl + match.home_team.abbreviation">
                        </div>
                        <div class="col-7 d-flex align-items-center">{{ match.home_team.name }}</div>
                        <div class="col-2 d-flex align-items-center">{{ match.home_score }}</div>
                        
                        <div class="col-3">
                            <img class="img-fluid d-flex align-items-center" 
                                :src="flagsUrl + match.away_team.abbreviation">
                        </div>
                        <div class="col-7 d-flex align-items-center">{{ match.away_team.name }}</div>
                        <div class="col-2 d-flex align-items-center">{{ match.away_score }}</div>
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
        token: null
    },
    created: function () {
        this.$on('logged-in', function (token) {
            this.loggedIn = true;
            this.token = token;
        });
    }
});