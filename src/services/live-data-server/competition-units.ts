import moment from 'moment';
import { SYRF_SERVER } from 'services/service-constants';
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
        params.from_date = params.from_date;
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
        params.to_date = params.to_date;
        query.bool.must.push({
            range: {
                "approx_start_time_ms": {
                    "lt": moment(params.to_date).set({ hour: 23, minute: 59, second: 59 }).unix() * 1000,
                }
            }
        });
    }

    const searchParams: any = {
        query: {
            "function_score": {                
                query: query,
                "field_value_factor": {
                    "field": "start_year",
                    "factor": 1
                },
            }
        },
        sort: params.sort ? [
            {
                "_score": {
                    "order": params.sort
                }
            },
            {
                "approx_start_time_ms": {
                    "order": params.sort
                }
            }
        ] : []
    };

    searchParams._source = ["id", "source", "name", "approx_start_point", "start_country", "start_city", "start_year", "start_month", "approx_start_time_ms", "event_name", "event", "event_description"]; // only the fields we need
    searchParams.from = params.hasOwnProperty('page') ? ((Number(params.page) - 1) * Number(params?.size)) : 0;
    searchParams.size = params.size ?? 10;

    window?.history?.pushState('', 'syrf.io', '/?' + Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&'));

    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/search`, searchParams))
}

export const create = (calendarEventId, data) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units`, {
        ...data
    }))
}

export const getAllByCalendarEventId = (calendarEventId, page, size = 10) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units`, {
        params: {
            page: page,
            size: size,
        }
    }));
}

export const getAllCompetitionUnits = (page) => {
    const userId: any = localStorage.getItem('user_id');
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units${!!userId ? `?createdById_eq=${userId}` : ''}`, {
        params: {
            page: page
        }
    }))
}

export const get = (calendarEventId, competitionUnitId) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units/${competitionUnitId}`))
}

export const update = (calendarEventId, competitionUnitId, data) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units/${competitionUnitId}`, {
        ...data
    }))
}

export const deleteCompetitionUnit = (calendarEventId, competitionUnitId) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units/${competitionUnitId}`))
}

export const getCompetitionUnitList = () => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units`))
}

export const getCompetitionUnitById = (id) => {
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

    searchParams._source = ["id", "name", "approx_start_point", "start_country", "approx_start_time_ms", "url", "source"];

    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/search`, searchParams))
}

export const cloneCourse = (fromCompetitionUnitId, toCompetitionUnitId, newName) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${toCompetitionUnitId}/clone-course`, {
        cloneFromCompetitionId: fromCompetitionUnitId,
        newName: newName
    }))
}

export const getAllCompetitionUnitsByEventIdWithSort = (calendarEventId, page) => {
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

export const getSuggestion = (fieldName, word) => {
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

export const getRaceViewsCount = (competitionUnitId) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/viewers-count`));
}