<template>
    <div class="h-100">
        <nav class="navbar navbar-expand bg-info navbar-dark fixed-top bk-header">
            <div class="container">
                <div v-if="loggedIn === true" class="navbar-nav w-100 d-flex">

                    <a class="nav-item nav-link mr-auto" @click="logOut">
                        <font-awesome-icon icon="user-slash" class="fa-lg"></font-awesome-icon>
                        <span :class="responsiveDisplay">Déconnexion</span>
                    </a>

                    <router-link v-if="isAdmin" class="nav-item nav-link" to="/admin">
                        <font-awesome-icon icon="unlock" class="fa-lg"></font-awesome-icon>
                        <span :class="responsiveDisplay">Admin</span>
                    </router-link>

                    <router-link class="nav-item nav-link" to="/pronostics">
                        <font-awesome-icon icon="futbol" class="fa-lg"></font-awesome-icon>
                        <span :class="responsiveDisplay">Matchs</span>
                    </router-link>

                    <router-link class="nav-item nav-link" to="/classement">
                        <font-awesome-icon icon="list-ol" class="fa-lg"></font-awesome-icon>
                        <span :class="responsiveDisplay">Classement</span>
                    </router-link>

                    <router-link class="nav-item nav-link" to="/historique">
                        <font-awesome-icon icon="history" class="fa-lg"></font-awesome-icon>
                        <span :class="responsiveDisplay">Historique</span>
                    </router-link>

                </div>
                <span v-else class="navbar-brand w-100 text-center">
                    Alfred Wallace Bookie
                </span>
            </div>
        </nav>
        <div id="main-container" class="container h-100">

            <router-view v-if="loggedIn === true" :api-base-url="apiBaseUrl" :token="token" :user-id="userId">
            </router-view>

            <login-form v-else :api-base-url="apiBaseUrl"></login-form>

            <notifications position="top left">
                <template slot="body" slot-scope="props">
                    <div class="bk-notif rounded d-flex justify-content-between align-items-center border"
                         :class="props.item.type">
                        <div v-html="props.item.text"></div>
                        <font-awesome-icon icon="times-circle" @click="props.close" class="bk-cursor">
                        </font-awesome-icon>
                    </div>
                </template>
            </notifications>
        </div>
    </div>
</template>

<script>
    import LoginForm from './components/LoginForm';

    export default {
        name: "App",
        components: {LoginForm},
        data () {
            return {
                loggedIn: false,
                apiBaseUrl: process.env.BOOKIE_API_URL,
                token: null,
                payload: null,
                userId: null,
                isAdmin: false,
                responsiveDisplay: 'd-none d-lg-inline'
            };
        },
        created () {
            let token = this.$cookie.get('BEARER');
            if (token !== null) {
                this.logIn(token);
            }
        },
        mounted () {
            this.$root.$on('logged-in', (token) => {
                this.logIn(token);
            });
            this.$root.$on('logged-out', () => {
                this.logOut();
            })
        },
        methods: {
            isTokenExpired () {
                if (this.payload !== null && this.payload.hasOwnProperty('exp')) {
                    let currentTimestamp = (new Date()).getTime() / 1000;
                    if (this.payload.exp > currentTimestamp) {
                        return false;
                    }
                }
                return true;
            },
            logIn (token) {
                this.token = token;
                this.payload = JSON.parse(window.atob(this.token.split('.')[1]));
                if (!this.isTokenExpired()) {
                    this.loggedIn = true;

                    if (this.payload.hasOwnProperty('userId')) {
                        this.userId = this.payload.userId;
                    }
                    if (this.payload.hasOwnProperty('roles') && this.payload.roles.hasOwnProperty('ROLE_ADMIN')) {
                        this.isAdmin = true;
                    }
                }
            },
            logOut () {
                this.$cookie.delete('BEARER');
                this.loggedIn = false;
                this.token = null;
                this.payload = null;
                this.userId = null;
                this.isAdmin = false;
            }
        },
    }
</script>

<style scoped>

</style>
