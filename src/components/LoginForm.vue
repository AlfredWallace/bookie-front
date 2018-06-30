<template>
    <div id="login_form" class="row h-100 align-items-center justify-content-around">
        <div class="col-md-6 col-lg-4">
            <div class="form-group">
                <input type="text" v-model="userLogin" placeholder="Username" :disabled="loading === true"
                       class="form-control form-control-lg" @keyup.enter="connectPlayer">
            </div>
            <div class="form-group">
                <input type="password" v-model="userPassword" placeholder="Password" :disabled="loading === true"
                       class="form-control form-control-lg" @keyup.enter="connectPlayer">
            </div>
            <div class="d-flex">
                <button @click="connectPlayer" :disabled="loading === true" class="btn btn-info">
                    Se connecter
                </button>
                <button @click="createAccount" :disabled="loading === true" class="btn btn-link ml-auto">
                    Créer un compte
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapState} from 'vuex';

    export default {
        name: "LoginForm",
        data() {
            return {
                userLogin: '',
                userPassword: '',
                loading: false
            };
        },
        computed: mapState(['apiBaseUrl']),
        methods: Object.assign({
            connectPlayer() {
                this.loading = true;
                this.axios.post(this.apiBaseUrl + '/login_check', {
                    username: this.userLogin,
                    password: this.userPassword
                }).then((response) => {
                    if (response.hasOwnProperty('data') && response.data.hasOwnProperty('token')) {
                        this.logIn(response.data.token);
                        this.$cookie.set('BEARER', response.data.token, {expires: 7});
                        this.$router.push({name: 'bets'});
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            createAccount() {
                this.loading = true;
                this.axios.post(this.apiBaseUrl + '/users/new', {
                    username: this.userLogin,
                    password: this.userPassword
                }).then((response) => {
                    if (response.hasOwnProperty('data') && response.data.hasOwnProperty('id')) {
                        this.connectPlayer();
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
        }, mapMutations(['logIn']))
    }
</script>

<style lang="sass" scoped>

</style>
