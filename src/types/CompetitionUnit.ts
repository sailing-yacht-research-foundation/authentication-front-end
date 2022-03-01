import { RaceStatus } from "utils/constants";
import { CalendarEvent } from "./CalendarEvent";
import { EventLocation } from "./EventLocation";

export interface CompetitionUnit {
    id: string;
    name: string;
    startTime: Date;
    endTime?: Date;
    approximateStart: Date;
    approximateStart_utc: Date;
    approximateStart_zone: string;
    timeLimit?: any;
    isCompleted: boolean;
    isSavedByEngine: boolean;
    boundingBox: any;
    courseId: string;
    calendarEventId: string;
    vesselParticipantGroupId: string;
    description: string;
    approximateStartLocation: EventLocation;
    approximateEndLocation: any;
    country: string;
    city: string;
    status: RaceStatus;
    openGraphImage: string;
    scrapedOriginalId: string;
    scrapedUrl: string;
    handicap: any;
    failedSetupCount: number;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
    updatedById: string;
    developerId: string;
    calendarEvent: CalendarEvent;
}