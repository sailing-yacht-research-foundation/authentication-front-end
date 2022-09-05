import { Participant } from "./Participant";
import { Vessel } from "./Vessel";
import { VesselParticipantGroup } from "./VesselParticipantGroup";

export interface VesselParticipant {
    id: string;
    vesselParticipantId: string;
    vesselId: string;
    vesselParticipantGroupId: string;
    vessel: Vessel;
    group: VesselParticipantGroup;
    participant?: Participant
    sailNumber?: string;
}
