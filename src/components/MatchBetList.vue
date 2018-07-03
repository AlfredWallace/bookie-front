<template>
    <div class="row bk-header-shift">
        <match-bet v-for="match in matches" :match-id="match.id" :key="match.id"></match-bet>
    </div>
</template>

<script>
    import MatchBet from './MatchBet';
    import {mapState} from 'vuex';

    export default {
        name: "MatchBetList",
        components: {MatchBet},
        computed: mapState('matchModule', ['matches']),
    }
</script>

<style scoped>

</style>
