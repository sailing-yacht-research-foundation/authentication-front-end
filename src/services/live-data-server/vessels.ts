import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getMany = (page: number, size: number = 10) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels?bulkCreated_eq=false`, {
        params: {
            page,
            size
        }
    }))
}

export const get = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}`))
}

export const create = (data: any) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels`, {
        ...data
    }))
}

export const update = (id: string, data: any) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}`, {
        ...data
    }))
}

export const createMultipart = (formData: FormData) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/create`, formData, {
        headers: { "content-type": "multipart/form-data" }
    }))
}

export const updateMultipart = (id: string, formData: FormData) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}/update`, formData, {
        headers: { "content-type": "multipart/form-data" }
    }))
}

export const deleteVessel = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}`))
}

export const getManyVesselsByEventCalendarId = (calendarEventId, page) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/vessels`, {
        params: {
            page: page
        }
    }))
}

export const uploadVesselPDF = (vesselId: string, formData: FormData) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/upload-pdfs`, formData, {
        headers: { "content-type": "multipart/form-data" }
    }))
}

export const removePhotos = (vesselId: string, options: any) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/remove-photos`, {
        data: {
            ...options
        }
    }))
}

export const sendPhoneVerification = (vesselId: string, field: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/send-verification-sms`, {
        field
    }))
}

export const verifyPhones = (vesselId: string, field: string, code: any) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/verify-sms`, {
        field,
        code
    }))
}

export const sendOnboardEmailCode = (vesselId) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/send-verification-email`))
}

export const verifyOnboardEmail = (vesselId, code) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/verify-email`, {
        "code": code
    }))
}