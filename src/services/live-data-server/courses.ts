import { SYRF_SERVER } from 'services/service-constants';
import { formatRequestPromiseResponse } from 'utils/helpers';
import syrfService from 'utils/syrf-request';

export const list = () => {
    return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses`))
}

export const create = (eventId, name, courseSequencedGeometries) => {
    return formatRequestPromiseResponse(syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses`, {
        courseSequencedGeometries: courseSequencedGeometries,
        calendarEventId: eventId,
        name: name
    }))
}

export const deleteCourse = (courseId) => {
    return formatRequestPromiseResponse(syrfService.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}`))
}

export const update = (eventId, courseId, name, courseSequencedGeometries) => {
    return formatRequestPromiseResponse(syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/courses/${courseId}`, {
        courseSequencedGeometries: courseSequencedGeometries,
        name: name
    }))
}

export const updateCourseGeometry = (courseId, name, courseSequencedGeometries) => {
    return formatRequestPromiseResponse(syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}/sequenced`, courseSequencedGeometries));
}

export const getByCompetitionUnit = (competitionUnitId) => {
    return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/course`))
}

export const getById = (courseId) => {
    return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}`))
}

export const getByEventId = (eventId, params) => {
    return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/courses`, {
        params: params
    }))
}