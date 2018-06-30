<template>
    <!--<tr :class="classObject">-->
    <tr :class="[this.match.is_over ? (this.bet.points > 0 ? 'text-success' : 'text-danger') : '', this.auth.userId === this.bet.userId ? 'bg-light font-weight-bold' : '']">
        <td>{{ bet.username.length > 10 ? bet.username.substring(0,7) + '...' : bet.username }}</td>
        <td class="text-center">{{ bet.home_score }} - {{ bet.away_score }}</td>
        <td class="text-right">{{ bet.points }}</td>
        <td class="text-right">{{ bet.points_alternative }}</td>
    </tr>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: "Bet",
        // data () {
        //     return {
        //         classObject: {
        //             'text-success': this.match.is_over && this.bet.points > 0,
        //             'text-danger': this.match.is_over && this.bet.points === 0,
        //             'bg-light font-weight-bold': this.auth.userId === this.bet.userId
        //         }
        //     };
        // },
        props: ['bet', 'match'],
        computed: mapState(['auth']),
        // methods: mapGetters({ getMatch: 'match/getMatch'}),
        // computed: Object.assign(
        //     mapState(['auth']),
        //     {
                // classObject: {
                //     'text-success': this.match.is_over && this.bet.points > 0,
                //     'text-danger': this.match.is_over && this.bet.points === 0,
                //     'bg-light font-weight-bold': this.auth.userId === this.bet.userId
                // }
            // }
        // ),
    }
</script>

<style scoped>

</style>