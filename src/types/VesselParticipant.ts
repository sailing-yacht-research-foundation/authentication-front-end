export interface VesselParticipantPosition {
  lat: number;
  lon: number;
  timestamp: number;
  cog?: number;
  sog?: number;
  twa?: number;
  heading?: any;
}

export interface VesselParticipant {
  id: string;
  color: string;
  deviceType: string;
  lastPosition: VesselParticipantPosition;
  positions: VesselParticipantPosition[];
  participant: {
    competitor?: string;
    sail_number?: string;
  }
}
