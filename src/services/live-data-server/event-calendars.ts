import { SYRF_SERVER } from 'services/service-constants';
import { CalendarEvent } from 'types/CalendarEvent';
import { EventState } from 'utils/constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getAll = () => {
    const userId: any = localStorage.getItem('user_id');
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events${!!userId ? `?createdById_eq=${userId}` : ''}`))
}

export const getMany = (page: string, size: number = 10) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/my-events?isPrivate_eq=false`, {
        params: {
            page,
            size
        }
    }))
}

export const get = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${id}`))
}

export const create = (data) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events`, {
        ...data
    }))
}

export const update = (id: string, data) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${id}`, {
        ...data
    }));
}

export const deleteEvent = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${id}`))
}

export const downloadIcalendarFile = (event: Partial<CalendarEvent>) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${event.id}/ics`, { responseType: 'blob' }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${event.name}.ics`); //or any other extension
        document.body.appendChild(link);
        link.click();
    }).catch(error => {
        return {
            success: false,
            error: error
        }
    })
}

export const getEditors = (eventId: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/editors`))
}

export const addEditor = (eventId: string, editorId: string) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/add-editors`, {
        userIds: [
            editorId
        ]
    }))
}

export const removeEditor = (eventId: string, editorId: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/remove-editors`, {
        data: {
            userIds: [
                editorId
            ]
        }
    }));
}

export const scheduleCalendarEvent = (eventId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/status`, {
        status: EventState.SCHEDULED
    }));
}

export const toggleOpenForRegistration = (eventId: string, allowRegistration: boolean) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/manage-registration`, {
        allowRegistration
    }));
}

export const closeCalendarEvent = (eventId: string) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/stop`))
}

export const cancelCalendarEvent = (eventId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/status`, {
        status: EventState.CANCELED
    }));
}

export const stopEvent = (calendarEventId: string) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/stop`));
}

export const getEventRegisteredVessels = (calendarEventId: string, page: number) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/registered-vessels`, {
        params: {
            page
        }
    }));
}

export const uploadPdfs = (calendarEventId: string, formData: FormData) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/upload-pdfs`, formData,  {
        headers: { "content-type": "multipart/form-data" }
    }));
}

export const sendMessageToVesselParticipants = (calendarEventId: string, data) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/send-messages`, data));
}

export const payForEvent = (calendarEventId: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/pay`));
}

export const getDetailedEventParticipantsInfo = (calendarEventId: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/participants/complete-data`));
}

export const agreeToWaiver = (calendarEventId: string, waiverType: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/agree-waiver`, {
        waiverType
    }));
}

export const getDetailedEventParticipantInfoById = (calendarEventId: string, participantId: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/participants/${participantId}/complete-data`));
}