export default {
    data () {
        return {
            loading: false
        };
    },
    template: `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card" :class="[ isToday ? 'border-warning' : 'border-info' ]">
                <div class="card-header text-center bk-match-card-header" 
                    :class="[ isToday ? 'bg-warning text-dark' : 'bg-info text-white' ]">
                    {{ formatedKickOff }}
                </div>
                <div class="card-body text-info bk-match-card-content">
                    <div class="container-fluid">
                        <div class="row align-items-center justify-content-center">
                            <div class="col d-flex justify-content-start align-items-center text-uppercase">
                                <div class="w-25">
                                    <img class="img-fluid" :src="flagsUrl + match.home_team.abbreviation" />
                                </div>
                                <div class="w-25 ml-3 bk-team-name">{{ match.home_team.abbreviation }}</div>
                                <div class="w-25 ml-auto">
                                    <input type="number" class="form-control form-control-lg" placeholder="0" step="1"
                                        v-model="match.home_bet" :readonly="loading == true">
                                </div>
                            </div>
                        </div>
                        <div class="row align-items-center justify-content-center">
                            <div class="col d-flex justify-content-start align-items-center text-uppercase">
                                <div class="w-25">
                                    <img class="img-fluid" :src="flagsUrl + match.away_team.abbreviation" />
                                </div>
                                <div class="w-25 ml-3 bk-team-name">{{ match.away_team.abbreviation }}</div>       
                                <div class="w-25 ml-auto">
                                    <input type="number" class="form-control form-control-lg" placeholder="0" step="1"
                                        v-model="match.away_bet" :readonly="loading == true">
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <button class="btn btn-lg btn-block" :class="btnColor" :disabled="loading == true"
                                    @click="saveResult">{{ btnSaveLabel }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
};