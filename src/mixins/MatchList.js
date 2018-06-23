export default {
    data () {
        return {
            matches: null,
            months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
            days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
        };
    },
    props: ['apiBaseUrl', 'token', 'userId'],
    created () {
        this.getMatches();
    },
    methods: {
        getMatches () {
            this.axios.get(this.apiBaseUrl + this.getMatchRoute, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then((response) => {
                if (response.hasOwnProperty('data')) {
                    this.matches = response.data;
                }
            }).catch(() => {
                this.$root.$emit('logged-out');
            });
        }
    }
};
