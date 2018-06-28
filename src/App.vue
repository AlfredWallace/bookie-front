<template>
    <div class="h-100">
        <nav class="navbar navbar-expand bg-info navbar-dark fixed-top bk-header">
            <div class="container">
                <div v-if="auth.loggedIn === true" class="navbar-nav w-100 d-flex">

                    <router-link class="nav-item nav-link mr-auto" to="/logout">
                        <font-awesome-icon icon="user-slash" class="fa-lg"></font-awesome-icon>
                        <span class="d-none d-lg-inline">Déconnexion</span>
                    </router-link>

                    <router-link v-if="auth.isAdmin" class="nav-item nav-link" to="/admin">
                        <font-awesome-icon icon="unlock" class="fa-lg"></font-awesome-icon>
                        <span class="d-none d-lg-inline">Admin</span>
                    </router-link>

                    <router-link class="nav-item nav-link" to="/pronostics">
                        <font-awesome-icon icon="futbol" class="fa-lg"></font-awesome-icon>
                        <span class="d-none d-lg-inline">Matchs</span>
                    </router-link>

                    <router-link class="nav-item nav-link" to="/classement">
                        <font-awesome-icon icon="list-ol" class="fa-lg"></font-awesome-icon>
                        <span class="d-none d-lg-inline">Classement</span>
                    </router-link>

                    <router-link class="nav-item nav-link" to="/historique">
                        <font-awesome-icon icon="history" class="fa-lg"></font-awesome-icon>
                        <span class="d-none d-lg-inline">Historique</span>
                    </router-link>

                </div>
                <span v-else class="navbar-brand w-100 text-center">
                    Alfred Wallace Bookie
                </span>
            </div>
        </nav>
        <div id="main-container" class="container h-100">

            <router-view></router-view>

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
    import { mapState } from 'vuex';
    import { mapMutations } from 'vuex';

    export default {
        name: "App",
        computed: mapState(['auth']),
        methods: mapMutations(['logIn']),
        created () {
            let token = this.$cookie.get('BEARER');
            if (token !== null) {
                this.logIn(token);
            }
        },
    }
</script>

<style scoped>

</style>
