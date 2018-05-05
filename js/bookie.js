Vue.component('login-form', {
    data: () => {
        return {
            userLogin:'',
            userPassword:''
        };
    },
    template: `
        <div id="login_form" class="row h-100 align-items-center justify-content-around">
            <div class="col col-md-6 col-lg-4">
                <div class="form-group">
                    <input type="text" v-model="userLogin" id="userLogin" placeholder="Username"
                           class="form-control form-control-lg">
                </div>
                <div class="form-group">
                    <input type="password" v-model="userPassword" id="userPassword" placeholder="Password"
                           class="form-control form-control-lg">
                </div>
                <button @click="getApiToken" class="btn btn-lg btn-info w-100">Login</button>
            </div>
        </div>
    `,
    methods: {
        getApiToken: function() {
            axios.post('http://local.bookie-api.alfred-wallace.com/login_check', {
                username: this.userLogin,
                password: this.userPassword
            }).then(function(response) {

                console.log(response);
            });
        }
    }
});

new Vue({
    el: '#main-container'
});