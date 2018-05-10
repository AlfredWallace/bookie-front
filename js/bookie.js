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
            <div class="col col-md-6 col-lg-4">
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
            }).catch(function (response) {
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
                    console.log(response.data);
                    matchList.matches = response.data;
                }
            }).catch(function (response) {
            });
        }
    },
    created: function () {
        this.getMatches();
    }
});

Vue.component('match', {
    props: ['match'],
    template: `
         <div class="col col-12">
            <div class="row">
                <div class="col col-12">{{ match.kick_off }}</div>
                <div class="col col-6">{{ match.home_team.name }}</div>
                <div class="col col-6">{{ match.away_team.name }}</div>
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