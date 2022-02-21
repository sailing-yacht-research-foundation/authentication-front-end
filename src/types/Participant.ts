import { VesselParticipant } from "./EventVesselParticipant";
import { Profile } from "./Profile";

export interface Participant {
    id: string;
    participantId?: string;
    publicName: string;
    trackerUrl?: string;
    calendarEventId: string;
    userProfileId: string;
    invitationStatus: string;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
    updatedById: string;
    developerId: string;
    vesselParticipants: VesselParticipant[];
    profile: Profile;
}