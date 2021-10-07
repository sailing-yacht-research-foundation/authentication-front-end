export interface Leg {
  elapsedTime?: number;
  endPoint: number[];
  legDistance?: number;
  legId: string;
  startPoint: number[];
  startTime: string;
  stopTime: string;
}

export interface RaceLeg {
  legs: Leg[];
  vesselParticipantId: string;
}

export interface NormalizedLeg {
  legId: string;
  coordinates: number[][];
  legDistance?: number;
  elapsedTime?: number;
  startTimestamp: number;
  stopTimestamp: number;
}

export interface NormalizedRaceLeg {
  color?: string;
  vesselParticipantId: string;
  legs: NormalizedLeg[];
}
