<script>
    import editableMatchMixin from '../mixins/EditableMatch';
    import {mapState} from 'vuex';

    export default {
        name: "MatchBet",
        props: ['match'],
        mixins: [editableMatchMixin],
        computed: mapState('match', ['flagsUrl']),
        data() {
            return {
                btnSaveLabel: 'Enregistrer mon pari',
                btnColor: 'btn-success'
            };
        },
        methods: {
            saveResult() {
                // this.loading = true;
                // this.axios.post(this.auth.apiBaseUrl + '/bets/group-stage',
                //     {
                //         user: this.auth.userId,
                //         match: this.match.id,
                //         home_score: this.homeScore === '' ? 0 : this.homeScore,
                //         away_score: this.awayScore === '' ? 0 : this.awayScore
                //     },
                //     {
                //         headers: {
                //             Authorization: `Bearer ${this.auth.token}`
                //         }
                //     }
                // ).then(() => {
                //     this.loading = false;
                //     this.$notify({
                //         type: 'success',
                //         text: 'Pari sauvegardé !'
                //     });
                // }).catch((error) => {
                //     this.loading = false;
                //     let errMsg = 'Erreur inconnue !';
                //     if (error.hasOwnProperty('response')
                //         && error.response.hasOwnProperty('data')
                //         && error.response.data.hasOwnProperty('message')) {
                //         errMsg = error.response.data.message;
                //     }
                //     this.$notify({
                //         type: 'error',
                //         text: errMsg
                //     });
                // });
            }
        },
    }
</script>

<style scoped>

</style>