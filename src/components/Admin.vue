<template>
    <div>
        <div class="row bk-header-shift">
            <div class="col-12 h1">
                Actions globales
            </div>
            <div class="col-12">
                <button @click="recalculateAll" class="btn btn-lg btn-danger">Recalculer tout</button>
                <hr class="display-4">
            </div>
        </div>
        <div class="row">
            <div class="col-12 h1">Matchs</div>
            <match-admin v-for="match in matches" :match="match" :key="match.id" :months="months" :days="days"
                         :user-id="userId" :token="token" :api-base-url="apiBaseUrl"></match-admin>
        </div>
    </div>
</template>

<script>
    import matchListMixin from '../mixins/MatchList.js';
    import MatchAdmin from './MatchAdmin';

    export default {
        name: "Admin",
        mixins: [matchListMixin],
        components: {MatchAdmin},
        data () {
            return {
                getMatchRoute: '/matches-started'
            };
        },
        methods: {
            recalculateAll () {
                this.axios.post(this.apiBaseUrl + '/users/refresh-all-points', null, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });
            }
        },
    }
</script>

<style scoped>

</style>