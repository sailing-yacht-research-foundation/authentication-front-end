export interface SimplifiedTrackData {
  position: number[];
  pingTime: number;
}

export interface SimplifiedTrack {
  vesselParticipantId: string;
  tracks: SimplifiedTrackData[];
}
