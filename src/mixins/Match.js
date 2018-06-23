export default {
    data: function() {
        return {
            flagsUrl: 'https://fsprdcdnpublic.azureedge.net/global-pictures/flags-fwc2018-4/'
        };
    },
    props: ['match', 'months', 'days', 'userId', 'token', 'apiBaseUrl'],
    computed: {
        formatedKickOff () {
            let kickOffDate = new Date(this.match.kick_off);
            let date = kickOffDate.getDate();
            let dateText = date === 1 ? date + 'er' : date;
            let day = this.days[kickOffDate.getDay()];
            let month = this.months[kickOffDate.getMonth()];
            let minutes = kickOffDate.getMinutes() < 10 ? '0' + kickOffDate.getMinutes() : kickOffDate.getMinutes();
            let hours = kickOffDate.getHours() < 10 ? '0' + kickOffDate.getHours() : kickOffDate.getHours();
            return day + ' ' + dateText + ' ' + month + ' à ' + hours + 'h' + minutes;
        },
        isToday () {
            let kickOffDate = new Date(this.match.kick_off);
            let today = new Date();

            return (today.getDate() === kickOffDate.getDate()
                && today.getMonth() === kickOffDate.getMonth()
                && today.getFullYear() === kickOffDate.getFullYear());
        }
    },
};