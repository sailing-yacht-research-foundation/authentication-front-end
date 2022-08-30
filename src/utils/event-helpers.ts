import { CalendarEvent } from "types/CalendarEvent";
import { etcUTCTimezone } from "./constants";

export const checkIfStartTimezoneEtcUTC = (event: Partial<CalendarEvent>) => event.approximateStartTime_zone === etcUTCTimezone;

export const checkIfEndTimezoneEtcUTC = (event: Partial<CalendarEvent>) => event.approximateEndTime_zone === etcUTCTimezone;
