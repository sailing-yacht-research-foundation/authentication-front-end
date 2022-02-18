import { CalendarEvent } from "./CalendarEvent";
import { CompetitionUnit } from "./CompetitionUnit";
import { VesselParticipant } from "./EventVesselParticipant";
import { Participant } from "./Participant";
import { VesselParticipantGroup } from "./VesselParticipantGroup";

export interface Track {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userProfileId: string;
    vesselParticipantId: string;
    crewId: string;
    participantId: string;
    competitionUnitId: string;
    vesselParticipantGroupId: string;
    calendarEventId: string;
    createdById: string;
    updatedById: string;
    developerId: string;
    event: CalendarEvent;
    group: VesselParticipantGroup;
    vesselParticipant: VesselParticipant;
    participant: Participant;
    competitionUnit: CompetitionUnit;
    trackJson: any;
}
