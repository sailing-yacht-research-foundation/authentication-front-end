import { SYRF_SERVER } from 'services/service-constants';
import { CourseSequencedGeometry } from 'types/Course';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfService from 'utils/syrf-request';

export const list = () => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses`))
}

export const create = (eventId: string, name: string, courseSequencedGeometries: CourseSequencedGeometry[]) => {
    return formatServicePromiseResponse(syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses`, {
        courseSequencedGeometries: courseSequencedGeometries,
        calendarEventId: eventId,
        name: name
    }))
}

export const deleteCourse = (courseId: string) => {
    return formatServicePromiseResponse(syrfService.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}`))
}

export const update = (eventId: string, courseId: string, name: string, courseSequencedGeometries: CourseSequencedGeometry[]) => {
    return formatServicePromiseResponse(syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/courses/${courseId}`, {
        courseSequencedGeometries: courseSequencedGeometries,
        name: name
    }))
}

export const getByCompetitionUnit = (competitionUnitId: string) => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/course`))
}

export const getById = (courseId: string) => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}`))
}

export const getByEventId = (eventId: string, params) => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/courses`, {
        params: params
    }))
}