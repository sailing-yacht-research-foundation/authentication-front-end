const syrfRequest = require('./syrf-request');

module.exports = {
    getEventDetail(eventId) {
        return syrfRequest.get(`${process.env.SYRF_API_URL}${process.env.SYRF_API_VERSION}/calendar-events/${eventId}`)
            .then(response => {
                return response.data;
            }).catch(error => {
                return null;
            })
    },

    getCompetitionUnitById(id) {
        return syrfRequest.get(`${process.env.SYRF_API_URL}${process.env.SYRF_API_VERSION}/competition-units/${id}`, {
        }).then(response => {
            return response.data;
        }).catch(error => {
            return null;
        });
    },

    searchScrapedRaceById(id) {
        const searchParams = {
            query: {
                match: {
                    '_id': id
                }
            },
        };

        searchParams._source = ["id", "name", "approx_start_point", "start_country", "approx_start_time_ms", "url", "source", "open_graph_image"];

        return syrfRequest.post(`${process.env.SYRF_API_URL}${process.env.SYRF_API_VERSION}/competition-units/search`, searchParams).then(response => {
            return response.data
        }).catch(error => {
            return null;
        });
    }
}