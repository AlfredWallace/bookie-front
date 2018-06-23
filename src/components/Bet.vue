<template>
    <tr :class="classObject">
        <td>{{ bet.user.username.length > 10 ? bet.user.username.substring(0,7) + '...' : bet.user.username }}</td>
        <td class="text-center">{{ bet.home_score }} - {{ bet.away_score }}</td>
        <td class="text-right">{{ bet.points }}</td>
        <td class="text-right">{{ bet.points_alternative }}</td>
    </tr>
</template>

<script>
    export default {
        name: "Bet",
        data () {
            return {
                classObject: {
                    'text-success': this.match.is_over && this.bet.points > 0,
                    'text-danger': this.match.is_over && this.bet.points === 0,
                    'bg-light font-weight-bold': this.userId === this.bet.user.id
                }
            };
        },
        props: ['bet', 'userId', 'match'],
    }
</script>

<style scoped>

</style>