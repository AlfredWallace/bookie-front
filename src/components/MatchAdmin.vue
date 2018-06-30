<script>
    import editableMatchMixin from '../mixins/EditableMatch';
    import {mapState} from 'vuex';

    export default {
        name: "MatchAdmin",
        props: ['match'],
        mixins: [editableMatchMixin],
        computed: mapState('matchModule', ['flagsUrl']),
        data() {
            return {
                btnSaveLabel: 'Clôturer le match',
                btnColor: 'btn-danger'
            };
        },
        methods: {
            saveResult() {
                // this.loading = true;
                // this.axios.post(this.apiBaseUrl + '/matches/' + this.match.id + '/end',
                //     {
                //         home_score: this.homeScore === '' ? 0 : this.homeScore,
                //         away_score: this.awayScore === '' ? 0 : this.awayScore
                //     },
                //     {
                //         headers: {
                //             Authorization: `Bearer ${this.token}`
                //         }
                //     }
                // ).then(() => {
                //     this.loading = false;
                //     this.$notify({
                //         type: 'success',
                //         text: 'Match clôturé !'
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