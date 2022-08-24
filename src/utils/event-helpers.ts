import { toast } from "react-toastify";
import { CalendarEvent } from "types/CalendarEvent";
import { EventState, MODE, RaceSource, UserRole } from "./constants";
import { translations } from "locales/translations";
import i18next from "i18next";

export const canManageEvent = (event: Partial<CalendarEvent>, authUser, mode, history) => {

    if (authUser.id && event.id && mode === MODE.UPDATE) {
        if (authUser.role === UserRole.SUPER_ADMIN && event.source !== RaceSource.SYRF) return;

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
