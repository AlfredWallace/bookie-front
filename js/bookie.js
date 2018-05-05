Vue.component('login-form', {
    data: function() {
        return {
            userLogin:'',
            userPassword:'',
            loading: false
        };
    },
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
            axios.post('http://local.bookie-api.alfred-wallace.com/login_check', {
                username: this.userLogin,
                password: this.userPassword
            }).then(function(response) {
                loginForm.$root.$emit('logged-in');
            }).catch(function (response) {
                loginForm.loading = false;
            });
        }
    }
});

Vue.component('authenticated-content', {
    template: `
        <div class="row">
            <div class="col">
                Logged in !
            </div>
        </div>
    `
});

new Vue({
    el: '#main-container',
    data: {
        loggedIn: false
    },
    created: function () {
        this.$on('logged-in', function () {
            this.loggedIn = true;
        });
    }
});