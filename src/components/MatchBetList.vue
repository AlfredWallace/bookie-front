<template>
    <div class="row bk-header-shift">
        <match-bet v-for="match in matches" :match="match" :key="match.id"></match-bet>
    </div>
</template>

<script>
    // import matchListMixin from '../mixins/MatchList.js';
    // import { createNamespacedHelpers } from 'vuex'
    // const { mapState, mapMutations, mapActions } = createNamespacedHelpers('match');
    import MatchBet from './MatchBet';
    import { mapState, mapActions } from 'vuex';

    export default {
        name: "MatchBetList",
        computed: Object.assign(
            mapState([ 'auth' ]),
            mapState('match', [ 'matches' ])
        ),
        methods: mapActions({ fetchMatches: 'match/fetchMatches' }),
        created () {
            this.fetchMatches('/matches-bets/' + this.auth.userId);
            // this.$store.dispatch('fetchMatches', '/matches-bets/' + this.auth.userId);
        },
        // data () {
        //     return {
        //         getMatchRoute: '/matches-bets/' + this.auth.userId
        //     };
        // },
        // mixins: [matchListMixin],
        components: { MatchBet },
    }
</script>

<style scoped>

</style>
