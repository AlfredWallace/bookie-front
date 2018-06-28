<template>
    <div class="row bk-header-shift">
        <match-bet v-for="match in matches" :match="match" :key="match.id"></match-bet>
    </div>
</template>

<script>
    import MatchBet from './MatchBet';
    import { mapState, mapActions } from 'vuex';

    export default {
        name: "MatchBetList",
        components: { MatchBet },
        computed: Object.assign(
            mapState([ 'auth' ]),
            mapState('match', [ 'matches' ])
        ),
        methods: mapActions({ fetchMatches: 'match/fetchMatches' }),
        created () {
            this.fetchMatches('/matches-bets/' + this.auth.userId);
        },
    }
</script>

<style scoped>

</style>
