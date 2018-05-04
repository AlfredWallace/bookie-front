new Vue({
    el: '#login_form',
    data: {
        userLogin:'',
        userPassword:''
    },
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