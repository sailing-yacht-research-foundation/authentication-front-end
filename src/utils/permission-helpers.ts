import { toast } from "react-toastify";
import { CalendarEvent } from "types/CalendarEvent";
import { Vessel } from "types/Vessel";
import { EventState, MODE, RaceSource, UserRole } from "./constants";
import { translations } from "locales/translations";
import i18next from "i18next";

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

export const canRegisterEvent = (event: Partial<CalendarEvent>) => {
    const eventIsRegattaAndOngoingOrScheduled = event.isOpen && event.allowRegistration && [EventState.ON_GOING, EventState.SCHEDULED].includes(event.status!);
    const isNotEventEditorOrParticipant = !event.isEditor && !event.isParticipant;

    return eventIsRegattaAndOngoingOrScheduled && isNotEventEditorOrParticipant;
}

export const canManageEventAndRedirect = (event: Partial<CalendarEvent>, authUser, mode, history) => {
  if (authUser.id && event.id && mode === MODE.UPDATE) {
      if (isSuperAdminAndIsScraped(event, authUser)) return;

      if (!event.isEditor) {
          toast.info(i18next.t(translations.competition_unit_create_update_page.your_not_the_event_editor_therefore_you_cannot_edit_the_event))
          return history.push('/events');
      }

      if ([EventState.COMPLETED, EventState.CANCELED].includes(event.status!)) {
          toast.info(i18next.t(translations.competition_unit_create_update_page.event_is_canceled_or_completed_you_cannot_manage_it_from_this_point))
          return history.push('/events');
      }
  }
}

export const isSuperAdminAndIsScraped = (event: Partial<CalendarEvent>, authUser) => {
    return authUser.role === UserRole.SUPER_ADMIN && event.source !== RaceSource.SYRF && event.source !== RaceSource.IMPORT;
}
