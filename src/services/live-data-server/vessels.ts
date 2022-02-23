import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getMany = (page, size = 10) => {
    const userId: any = localStorage.getItem('user_id');
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels?bulkCreated_eq=false`, {
        params: {
            page,
            size
        }
    }))
}

export const get = (id) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}`))
}

export const create = (data) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels`, {
        ...data
    }))
}

export const update = (id, data) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}`, {
        ...data
    }))
}

export const createMultipart = (formData) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/create`, formData, {
        headers: { "content-type": "multipart/form-data" }
    }))
}

export const updateMultipart = (id, formData) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}/update`, formData, {
        headers: { "content-type": "multipart/form-data" }
    }))
}

export const deleteVessel = (id) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}`))
}

export const getManyVesselsByEventCalendarId = (calendarEventId, page) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/vessels`, {
        params: {
            page: page
        }
    }))
}

export const uploadVesselPDF = (vesselId, formData) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/upload-pdfs`, formData, {
        headers: { "content-type": "multipart/form-data" }
    }))
}

export const removePhotos = (vesselId, options) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/remove-photos`, {
        data: {
            ...options
        }
    }))
}

export const sendPhoneVerification = (vesselId, field) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/send-verification-sms`, {
        field
    }))
}

export const verifyPhones = (vesselId, field, code) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/verify-sms`, {
        field,
        code
    }))
}