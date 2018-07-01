<script>
    import editableMatchMixin from '../mixins/EditableMatch';
    import {mapMutations} from 'vuex';

    export default {
        name: "MatchAdmin",
        mixins: [editableMatchMixin],
        computed: {
            homeScore: {
                get() {
                    return this.match.home_score;
                },
                set(score) {
                    this.setHomeScore({id: this.matchId, score: score});
                },
            },
            awayScore: {
                get() {
                    return this.match.away_score;
                },
                set(score) {
                    this.setAwayScore({id: this.matchId, score: score});
                },
            },
        },
        data() {
            return {
                btnSaveLabel: 'Clôturer le match',
                btnColor: 'btn-danger'
            };
        },
        methods: Object.assign(
            mapMutations({
                setHomeScore: 'matchModule/setHomeScore',
                setAwayScore: 'matchModule/setAwayScore',
            }),
        ),
    }
</script>

<style scoped>

</style>