import * as turf from "@turf/turf";
import { CourseGeometrySequenced, MappedCourseGeometrySequenced } from "types/CourseGeometry";
import { NormalizedLeg, NormalizedRaceLeg, RaceLeg } from "types/RaceLeg";
import { SimplifiedTrack, SimplifiedTrackData } from "types/SimplifiedTrack";
import {
  VesselParitipantNearestPositions,
  VesselParticipant,
  VesselParticipantPosition,
} from "types/VesselParticipant";

export const generateLastHeading = (coordinate1, coordinate2) => {
  const point1 = turf.point(coordinate1);
  const point2 = turf.point(coordinate2);

  return turf.bearing(point1, point2);
};

export const generateLastArray = (arrayData: any[], maxSize: number) => {
  const result: any[] = [];

  // Positions length
  let length = arrayData.length;

  // Limit
  let limit = length - maxSize;
  if (length - maxSize < 0) limit = 0;

  // Select latest positions
  for (let index = length - 1; index >= limit; index--) {
    result.push(arrayData[index]);
  }

  return result;
};

export const formatCoordinatesObjectToArray = (coordinatesObject: { lat: number; lon: number }[]) => {
  const result: any[] = [];

  for (let index = 0; index < coordinatesObject.length; index++) {
    const coord = coordinatesObject[index];
    if (coord.lat && coord.lon) result.push([coord.lat, coord.lon]);
  }

  return result;
};

export const normalizeSimplifiedTracksPingTime = (startTime: number, simplifiedTracks: SimplifiedTrack[]) => {
  if (!startTime || !simplifiedTracks.length) return [];

  const normalizedSimplifiedTracks = simplifiedTracks.map((simplifiedTrack) => {
    const newTracks = simplifiedTrack.tracks.map((track) => {
      const normalizedPingTime = track.pingTime - startTime;
      return { ...track, pingTime: normalizedPingTime };
    });

    return { ...simplifiedTrack, tracks: newTracks };
  });

  return normalizedSimplifiedTracks;
};

export const turnTracksToVesselParticipantsData = (vesselParticipants, tracks) => {
  tracks.forEach(track => {
    if (vesselParticipants[track?.vesselParticipantId]?.positions)
      vesselParticipants[track?.vesselParticipantId].positions = track.tracks.map(t => {
        return {
          lon: t.position[0],
          lat: t.position[1],
          timestamp: t.pingTime
        }
      })
  })

  return vesselParticipants;
}

export const selectLatestPositionOfSimplifiedTracks = (targetTime: number, simplifiedTracks: SimplifiedTrack[]) => {
  if (targetTime < 0 || !simplifiedTracks.length) return [];

  const lastTracks: SimplifiedTrackData[] = [];

  simplifiedTracks.map((simplifiedTrack) => {
    const latestTracks = simplifiedTrack.tracks.filter((track) => track.pingTime <= targetTime);
    const lastTrack = latestTracks[latestTracks.length - 1];
    lastTracks.push(lastTrack);
    return { ...simplifiedTrack, tracks: latestTracks };
  });

  lastTracks.sort((a, b) => b.pingTime - a.pingTime);

  return lastTracks[0] || false;
};

export const generateRetrievedTimestamp = (vesselParticipants: VesselParticipant[]): number[] => {
  const availableTimestamps: number[] = [];

  if (!vesselParticipants.length) return [];

  // Get the unique timestamp
  vesselParticipants.forEach((vP) => {
    vP.positions.forEach((pos) => {
      if (!availableTimestamps.includes(pos.timestamp)) availableTimestamps.push(pos.timestamp);
    });
  });

  availableTimestamps.sort((a, b) => a - b);

  return availableTimestamps;
};

export const normalizeSequencedGeometries = (
  sequencedGeometries: CourseGeometrySequenced[]
): MappedCourseGeometrySequenced[] => {
  return sequencedGeometries.map((sG) => {

    const coordinates = sG.points.map((point) => point.position);

    return {
      id: sG.id,
      geometryType: sG.geometryType,
      coordinates: coordinates,
      properties: sG?.properties,
      points: sG?.points
    };
  });
};

export const generateRaceLegsData = (legsData: RaceLeg[], startTime: number) => {
  const newData: NormalizedRaceLeg[] = legsData.map((legData) => {
    const normalizedLegs: NormalizedLeg[] = legData.legs.map((leg) => {
      const switchedCoordinates = {
        start: [leg.startPoint[1], leg.startPoint[0]],
        end: [leg.endPoint[1], leg.endPoint[0]],
      };

      const coordinates = [switchedCoordinates.start, switchedCoordinates.end];
      const startTimestamp = new Date(leg.startTime).getTime() - startTime;
      const stopTimestamp = new Date(leg.stopTime).getTime() - startTime;

      return {
        legId: leg.legId,
        legDistance: leg.legDistance,
        elapsedTime: leg.elapsedTime,
        coordinates,
        startTimestamp,
        stopTimestamp,
      };
    });

    return {
      legs: normalizedLegs,
      vesselParticipantId: legData.vesselParticipantId,
    };
  });

  return newData;
};

export const limitRaceLegsDataByElapsedTime = (raceLegs: NormalizedRaceLeg[], elapsedTime: number) => {
  const filteredRaceLegDatas = raceLegs.map((raceLegData) => {
    const legs = raceLegData.legs.filter(
      (leg) => elapsedTime >= leg.startTimestamp && elapsedTime <= leg.stopTimestamp
    );

    return {
      ...raceLegData,
      legs,
    };
  });

  return filteredRaceLegDatas;
};

export const findNearestRetrievedTimestamp = (
  retrievedTimestamps: number[],
  elapsedTime: number,
  rangeLimit: number
) => {
  const previousTs = retrievedTimestamps.filter((ts) => {
    return ts >= elapsedTime - rangeLimit && ts <= elapsedTime;
  });

  previousTs.sort((a, b) => a - b);

  const nextTs = retrievedTimestamps.filter((ts) => {
    return ts >= elapsedTime && ts <= elapsedTime + rangeLimit;
  });

  nextTs.sort((a, b) => a - b);

  return { previous: previousTs, next: nextTs };
};

export const checkIsForcedToInstallAppOnMobile = (source) => {
  const allowedWebviewOnMobile = ['KWINDOO', 'RACEQS', 'TACKTRACKER', 'YACHTBOT', 'GEOVOILE', 'ESTELA', 'BLUEWATER'];
  if (allowedWebviewOnMobile.includes(source)) {
    return false;
  }

  return true;
}