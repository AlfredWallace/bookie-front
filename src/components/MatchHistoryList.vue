<template>
    <div class="row bk-header-shift">
        <match-history v-for="match in matches" :match="match" :key="match.id"></match-history>
    </div>
</template>

<script>
    import MatchHistory from './MatchHistory';
    import { mapState, mapActions } from 'vuex';

    export default {
        name: "MatchHistoryList",
        components: { MatchHistory },
        computed: Object.assign(
            mapState([ 'auth' ]),
            mapState('match', [ 'matches' ])
        ),
        methods: mapActions({ fetchMatches: 'match/fetchMatches' }),
        created () {
            this.fetchMatches('/matches-started-bets');
        },
    }
</script>

<style scoped>

</style>