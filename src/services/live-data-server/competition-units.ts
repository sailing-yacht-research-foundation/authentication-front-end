import moment from 'moment';
import { SYRF_SERVER } from 'services/service-constants';
import { EventState, KudoTypes } from 'utils/constants';
import { formatServicePromiseResponse, parseKeyword } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const search = (params) => {
    const query: any = {
        bool: {
            must: []
        }
    };

    query.bool.must.push({
        query_string: {
            query: parseKeyword(params.keyword),
        },

    });

    if (params.hasOwnProperty('from_date')
        && params.from_date !== ''
        && moment(params.from_date).isValid()) {
        query.bool.must.push({
            range: {
                "approx_start_time_ms": {
                    "gte": moment(params.from_date).set({ hour: 0, minute: 0, second: 0 }).unix() * 1000,
                }
            }
        });
    }

    if (params.hasOwnProperty('to_date')
        && params.to_date !== ''
        && moment(params.to_date).isValid()) {
        query.bool.must.push({
            range: {
                "approx_start_time_ms": {
                    "lt": moment(params.to_date).set({ hour: 23, minute: 59, second: 59 }).unix() * 1000,
                }
            }
        });
    }

    const searchParams: any = {
        query: query,
        sort: [
            "_score",
            {
                "approx_start_time_ms": {
                    "order": "desc"
                }
            },
        ]
    };

    searchParams._source = [
        "id", "source", "name", "approx_start_point", "start_country", "start_city", "start_year", "start_month",
        "approx_start_time_ms", "event_name", "event", "event_description", "isOpen", "allowRegistration", "status",
        "approx_end_time_ms"
    ]; // only the fields we need
    searchParams.from = params.hasOwnProperty('page') ? ((Number(params.page) - 1) * Number(params?.size)) : 0;
    searchParams.size = params.size ?? 10;

    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/search`, searchParams))
}

export const create = (calendarEventId: string, data) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units`, {
        ...data
    }))
}

export const getAllByCalendarEventId = (calendarEventId: string, page: number, size: number = 10) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units`, {
        params: {
            page: page,
            size: size,
        }
    }));
}

export const getAllCompetitionUnits = (page: number) => {
    const userId: any = localStorage.getItem('user_id');
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units${!!userId ? `?createdById_eq=${userId}` : ''}`, {
        params: {
            page: page
        }
    }))
}

export const get = (calendarEventId: string, competitionUnitId: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units/${competitionUnitId}`))
}

export const update = (calendarEventId: string, competitionUnitId: string, data) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units/${competitionUnitId}`, {
        ...data
    }))
}

export const deleteCompetitionUnit = (calendarEventId?: string, competitionUnitId?: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units/${competitionUnitId}`))
}

export const getCompetitionUnitList = () => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units`))
}

export const getCompetitionUnitById = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}`));
};

export const searchScrapedRaceById = (id: string) => {
    const searchParams: any = {
        query: {
            match: {
                '_id': id
            }
        },
    };

    searchParams._source = ["id", "name", "approx_start_point", "start_country", "approx_start_time_ms", "url", "source", "isOpen", "allowRegistration"];

    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/search`, searchParams))
}

export const cloneCourse = (fromCompetitionUnitId: string, toCompetitionUnitId: string, newName: string) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${toCompetitionUnitId}/clone-course`, {
        cloneFromCompetitionId: fromCompetitionUnitId,
        newName: newName
    }))
}

export const getAllCompetitionUnitsByEventIdWithSort = (calendarEventId: string, page: number) => {
    const userId: any = localStorage.getItem('user_id');
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units?sort=createdAt&srdir=-1${!!userId ? `&createdById_eq=${userId}` : ''}`, {
        params: {
            page: page
        }
    }))
}

export const getSimplifiedTracksByCompetitionUnit = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}/simplified-tracks`))
}

export const getLegsByCompetitionUnit = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}/legs`))
}

export const getTimeByCompetitionUnit = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}/time`))
}

export const getCourseByCompetitionUnit = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}/course`))
}

export const getSuggestion = (fieldName: string, word: string) => {
    const searchParams = {
        "suggest": {
            "autocomplete": {
                "prefix": word,
                "completion": {
                    "field": `${fieldName}.completion`,
                    "skip_duplicates": true,
                    "fuzzy": {
                        "fuzziness": 1
                    }
                }
            }
        }
    };

    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/search`, searchParams))
}

export const getRaceViewsCount = (competitionUnitId: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/viewers-count`));
}

export const stopRace = (competitionUnitId: string) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/stop-race`));
}

export const startRace = (competitionUnitId: string) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/prepare-race`));
}

/**
 * Get live and happening soon races.
 * @param duration // in months
 * @param distance in mile
 * @param page 
 * @param size 
 * @param coordinate { lat, lon }
 * @returns 
 */
export const getLiveAndUpcomingRaces = (duration: number = 1, distance: number = 1000, page: number = 1, size: number = 10, coordinate) => {
    const query: any = {
        bool: {
            must: {},
            filter: [],
            should: [],
        },
    };

    if (coordinate) {
        query.bool.filter.push({
            "geo_distance": {
                "distance": `${distance}nmi`,
                "approx_start_point.coordinates": {
                    "lat": coordinate.lat,
                    "lon": coordinate.lon
                }
            }
        })
    }

    query.bool.must.bool = {  // WHERE (END_TIME > NOW() AND START_TIME LESS THAN RANGE) OR (END_TIME DOES NOT EXISTS AND START_TIME IN RANGE OR STATUS IN ('ONGOING', 'SCHEDULED'))  
        should: [             // OR START_TIME LESS THAN RANGE AND STATUS IN ('ONGOING', 'SCHEDULED')
            {
                bool: {
                    must: [
                        {
                            range: {
                                "approx_end_time_ms": { // end_time is greater than now means the race is on_going.
                                    "gte": moment().unix() * 1000
                                },

                            }
                        },
                        {
                            range: { // start_time is less than range so that we only get races in range.
                                "approx_start_time_ms": {
                                    "lt": moment().add(duration, "months").set({ hour: 23, minute: 59, second: 59 }).unix() * 1000,
                                },
                            }
                        }
                    ]
                }
            },
            {
                bool: { // end_time does not exist and start_time in range, so that races in the past are not included.
                    must_not: [
                        {
                            "exists": {
                                "field": "approx_end_time_ms"
                            }
                        }
                    ],
                    must: [
                        {
                            "range": {
                                "approx_start_time_ms": {
                                    "gte": moment().unix() * 1000,
                                    "lt": moment().add(duration, "months").set({ hour: 23, minute: 59, second: 59 }).unix() * 1000,
                                },

                            }
                        }
                    ],
                    should: [ /// this optional, it will get rows with that have the status field equal sheduled and ongoing if possible.
                        {
                            bool: {
                                should: [{
                                    "match": {
                                        "status": EventState.SCHEDULED
                                    }
                                },
                                {
                                    "match": {
                                        "status": EventState.ON_GOING
                                    }
                                }]
                            }
                        }
                    ]
                }
            },
            {
                bool: {
                    must: [ // start_time is less than range 
                        {
                            "range": {
                                "approx_start_time_ms": {
                                    "lt": moment().add(duration, "months").set({ hour: 23, minute: 59, second: 59 }).unix() * 1000,
                                },

                            }
                        },
                        {// and status equals scheduled and ongoing so that we only get sheduled and ongoing races, no races in the past are included.
                            bool: {
                                should: [
                                    {
                                        "match": {
                                            "status": EventState.SCHEDULED
                                        }
                                    },
                                    {
                                        "match": {
                                            "status": EventState.ON_GOING
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }

    const searchParams: any = {
        query: query,
        sort: [
            {
                "approx_start_time_ms": {
                    "order": "asc"
                }
            },
        ]
    };

    if (coordinate) {
        searchParams.sort.push({
            "_geo_distance": {
                "approx_start_point.coordinates": {
                    "lat": coordinate.lat,
                    "lon": coordinate.lon
                },
                "order": "asc",
            }
        })
    }

    searchParams._source = [
        "id", "source", "name", "approx_start_point", "start_country", "start_city", "start_year", "start_month",
        "approx_start_time_ms", "event_name", "event", "event_description", "isOpen", "allowRegistration", "status",
        "approx_end_time_ms"
    ]; // only the fields we need
    searchParams.from = (page - 1) * size;
    searchParams.size = size;

    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/search`, searchParams))
}

export const checkForUserRelationWithCompetitionUnits = (competitionUnits: string[] = []) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/check-user-relation`, competitionUnits))
}

export const markCompetitionUnitAsHidden = (competitionUnitId: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/mark-hidden`,))
}

export const markCompetitionUnitAsCompleted = (competitionUnitId: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/mark-finished`,))
}

export const forceDeleteCompetitionUnit = (competitionUnitId: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/force`));
}

export const sendKudos = (competitionUnitId: string, kudosType: KudoTypes, vesselParticipantId: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/send-kudos`, {
        vesselParticipantId,
        kudosType
    }));
}