import { CalendarEvent } from "types/CalendarEvent";
import { Vessel } from "types/Vessel";
import { EventState } from "./constants";

export const canDeleteVessel = (vessel: Partial<Vessel>) => {
    return vessel.createdById === localStorage.getItem('user_id');
}

export const canEditEvent = (event: Partial<CalendarEvent>) => {
    return event.isEditor && ![EventState.COMPLETED, EventState.CANCELED].includes(event.status!);
}

export const canDeleteEvent = (event: Partial<CalendarEvent>) => {
    return event.status === EventState.DRAFT;
}

export const canLeaveEvent = (event: Partial<CalendarEvent>) => {
    return event.isParticipant && event.participantId && [EventState.ON_GOING, EventState.SCHEDULED].includes(event.status!);
}

export const canManageEvent = (event: Partial<CalendarEvent>) => {
    return event.isEditor && ![EventState.COMPLETED, EventState.CANCELED].includes(event.status!);
}
