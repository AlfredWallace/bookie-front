<script>
    import matchMixin from '../mixins/Match';
    import editableMatchMixin from '../mixins/EditableMatch';

    export default {
        name: "MatchBet",
        mixins: [matchMixin, editableMatchMixin],
        created () {
            if (this.match.hasOwnProperty('home_bet')) {
                this.homeScore = this.match.home_bet;
            }
            if (this.match.hasOwnProperty('away_bet')) {
                this.awayScore = this.match.away_bet;
            }
        },
        data () {
            return {
                btnSaveLabel: 'Enregistrer mon pari',
                btnColor: 'btn-success'
            };
        },
        methods: {
            saveResult () {
                this.loading = true;
                this.axios.post(this.apiBaseUrl + '/bets/group-stage',
                    {
                        user: this.userId,
                        match: this.match.id,
                        home_score: this.homeScore === '' ? 0 : this.homeScore,
                        away_score: this.awayScore === '' ? 0 : this.awayScore
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.token}`
                        }
                    }
                ).then(() => {
                    this.loading = false;
                    this.$notify({
                        type: 'success',
                        text: 'Pari sauvegardé !'
                    });
                }).catch((error) => {
                    this.loading = false;
                    let errMsg = 'Erreur inconnue !';
                    if (error.hasOwnProperty('response')
                        && error.response.hasOwnProperty('data')
                        && error.response.data.hasOwnProperty('message')) {
                        errMsg = error.response.data.message;
                    }
                    this.$notify({
                        type: 'error',
                        text: errMsg
                    });
                });
            }
        },
    }
</script>

<style scoped>

</style>