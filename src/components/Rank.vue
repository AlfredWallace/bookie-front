<template>
    <tr :class="classObject">
        <td>{{ user.username.length > 20 ? user.username.substring(0,17) + '...' : user.username }}</td>
        <td class="text-right">{{ user.points }}</td>
        <td class="text-right">{{ user.points_alternative }}</td>
        <td class="text-right">{{ user.nbBets }}</td>
        <td class="text-right">{{ user.nbWins }}</td>
        <td class="text-right">{{ user.nbPerfects }}</td>
    </tr>
</template>

<script>
    export default {
        name: "Rank",
        data () {
            return {
                classObject: {
                    'text-info font-weight-bold': this.userId === this.user.id
                }
            };
        },
        props: ['user', 'userId'],
    }
</script>

<style scoped>

</style>