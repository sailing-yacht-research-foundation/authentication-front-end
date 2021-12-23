import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfService from 'utils/syrf-request';

export const list = () => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses`))
}

export const create = (eventId, name, courseSequencedGeometries) => {
    return formatServicePromiseResponse(syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses`, {
        courseSequencedGeometries: courseSequencedGeometries,
        calendarEventId: eventId,
        name: name
    }))
}

export const deleteCourse = (courseId) => {
    return formatServicePromiseResponse(syrfService.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}`))
}

export const update = (eventId, courseId, name, courseSequencedGeometries) => {
    return formatServicePromiseResponse(syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/courses/${courseId}`, {
        courseSequencedGeometries: courseSequencedGeometries,
        name: name
    }))
}

export const updateCourseGeometry = (courseId, name, courseSequencedGeometries) => {
    return formatServicePromiseResponse(syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}/sequenced`, courseSequencedGeometries));
}

export const getByCompetitionUnit = (competitionUnitId) => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/course`))
}

export const getById = (courseId) => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}`))
}

export const getByEventId = (eventId, params) => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/courses`, {
        params: params
    }))
}