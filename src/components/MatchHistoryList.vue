<template>
    <div class="row bk-header-shift">
        <match-history v-for="match in matches" :match="match" :key="match.id" :months="months" :days="days"
                       :user-id="userId"></match-history>
    </div>
</template>

<script>
    import matchListMixin from '../mixins/MatchList.js';
    import MatchHistory from './MatchHistory';

    export default {
        name: "MatchHistoryList",
        mixins: [matchListMixin],
        components: {MatchHistory},
        data () {
            return {
                getMatchRoute: '/matches-started-bets'
            };
        },
    }
</script>

<style scoped>

</style>