<template>
    <div class="h-100">
        <nav class="navbar navbar-expand bg-info navbar-dark fixed-top bk-header">
            <div class="container">
                <div v-if="loggedIn" class="navbar-nav w-100 d-flex">

                    <a class="nav-item nav-link mr-auto" href="#" @click="logOut">
                        <font-awesome-icon icon="user-slash" class="fa-lg"></font-awesome-icon>
                        <span :class="responsiveDisplay">Déconnexion</span>
                    </a>
                    <a v-if="isAdmin" class="nav-item nav-link" :class="{ active: page === 'admin' }" href="#"
                       @click="showAdmin">
                        <font-awesome-icon icon="unlock" class="fa-lg"></font-awesome-icon>
                        <span :class="responsiveDisplay">Admin</span>
                    </a>

                    <a class="nav-item nav-link" :class="{ active: page === 'match-bet-list' }" href="#"
                       @click="showMatchBetList">
                        <font-awesome-icon icon="futbol" class="fa-lg"></font-awesome-icon>
                        <span :class="responsiveDisplay">Matchs</span>
                    </a>

                    <a class="nav-item nav-link" :class="{ active: page === 'rank-list' }" href="#"
                       @click="showRankList">
                        <font-awesome-icon icon="list-ol" class="fa-lg"></font-awesome-icon>
                        <span :class="responsiveDisplay">Classement</span>
                    </a>

                    <a class="nav-item nav-link" :class="{ active: page === 'match-history-list' }" href="#"
                       @click="showMatchHistoryList">
                        <font-awesome-icon icon="history" class="fa-lg"></font-awesome-icon>
                        <span :class="responsiveDisplay">Historique</span>
                    </a>

                </div>
                <span v-else class="navbar-brand w-100 text-center">
                    Alfred Wallace Bookie
                </span>
            </div>
        </nav>
        <div id="main-container" class="container h-100">
            <match-bet-list v-if="loggedIn && page === 'match-bet-list'" :api-base-url="apiBaseUrl" :token="token"
                            :user-id="userId"></match-bet-list>

            <match-history-list v-if="loggedIn && page === 'match-history-list'" :api-base-url="apiBaseUrl" :token="token"
                                :user-id="userId"></match-history-list>

            <rank-list v-else-if="loggedIn && page === 'rank-list'" :api-base-url="apiBaseUrl" :token="token"
                       :user-id="userId"></rank-list>

            <admin v-else-if="loggedIn && page === 'admin'" :api-base-url="apiBaseUrl" :token="token"
                   :user-id="userId"></admin>

            <login-form v-else-if="loggedIn !== true" :api-base-url="apiBaseUrl"></login-form>

            <notifications position="top left">
                <template slot="body" slot-scope="props">
                    <div class="bk-notif rounded d-flex justify-content-between align-items-center border"
                         :class="props.item.type">
                        <div v-html="props.item.text"></div>
                        <font-awesome-icon icon="times-circle" @click="props.close" class="bk-cursor"></font-awesome-icon>
                    </div>
                </template>
            </notifications>
        </div>
    </div>
</template>

<script>
    import LoginForm from './components/LoginForm';
    import MatchBetList from './components/MatchBetList';
    import MatchHistoryList from './components/MatchHistoryList';
    import RankList from './components/RankList';
    import Admin from './components/Admin';

    export default {
        name: "App",
        components: {LoginForm, MatchBetList, MatchHistoryList, RankList, Admin},
        data () {
            return {
                loggedIn: false,
                apiBaseUrl: process.env.BOOKIE_API_URL,
                token: null,
                payload: null,
                userId: null,
                page: null,
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
            showRankList () {
                this.page = 'rank-list';
                this.setPageCookie();
            },
            showMatchBetList () {
                this.page = 'match-bet-list';
                this.setPageCookie();
            },
            showMatchHistoryList () {
                this.page = 'match-history-list';
                this.setPageCookie();
            },
            showAdmin () {
                this.page = 'admin';
                this.setPageCookie();
            },
            setPageCookie () {
                this.$cookie.set('landing_page', this.page, { expires: 7});
            },
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
            logOut () {
                this.$cookie.delete('BEARER');
                this.loggedIn = false;
                this.token = null;
                this.payload = null;
                this.userId = null;
                this.page = null;
                this.isAdmin = false;
            }
        },
    }
</script>

<style scoped>

</style>
