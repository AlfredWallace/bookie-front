<template>
    <div class="row bk-header-shift">
        <match-bet v-for="match in matches" :match="match" :key="match.id" :months="months" :days="days"
                   :user-id="userId" :token="token" :api-base-url="apiBaseUrl"></match-bet>
    </div>
</template>

<script>
    import matchListMixin from '../mixins/MatchList.js';
    import MatchBet from './MatchBet';

    export default {
        name: "MatchBetList",
        data () {
            return {
                getMatchRoute: '/matches-bets/' + this.userId
            };
        },
        mixins: [matchListMixin],
        components: {MatchBet},
    }
</script>

<style scoped>

</style>
