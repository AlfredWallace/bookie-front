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
            <match-admin v-for="match in matches" :match="match" :key="match.id"></match-admin>
        </div>
    </div>
</template>

<script>
    import MatchAdmin from './MatchAdmin';
    import { mapState, mapActions } from 'vuex';

    export default {
        name: "Admin",
        components: { MatchAdmin },
        computed: Object.assign(
            mapState([ 'auth' ]),
            mapState('match', [ 'matches' ])
        ),
        methods: Object.assign(
            mapActions({ fetchMatches: 'match/fetchMatches' }),
            {
                recalculateAll () {
                    this.axios.post(this.apiBaseUrl + '/users/refresh-all-points', null, {
                        headers: {
                            Authorization: `Bearer ${this.token}`
                        }
                    });
                }
            }
        ),
        created () {
            this.fetchMatches('/matches-started');
        },
    }
</script>

<style scoped>

</style>