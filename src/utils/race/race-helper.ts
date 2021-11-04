import * as turf from "@turf/turf";
import { CourseGeometrySequenced, MappedCourseGeometrySequenced } from "types/CourseGeometry";
import { NormalizedLeg, NormalizedRaceLeg, RaceLeg } from "types/RaceLeg";
import { SimplifiedTrack, SimplifiedTrackData } from "types/SimplifiedTrack";
import {
  VesselParitipantNearestPositions,
  VesselParticipant,
  VesselParticipantPosition,
} from "types/VesselParticipant";

export const calculateTrackPingTime = (tracks: any[]) => {
  const timeOffset = tracks[0].first_ping_time;
  let pingIndex = 0;
  for (let trackIndex in tracks) {
    const track = tracks[trackIndex];
    track.first_ping_time = track.first_ping_time - timeOffset;
    for (let positionIndex in track.track) {
      track.track[positionIndex][3] = track.track[positionIndex][3] - timeOffset;
      track.track[positionIndex][2] = pingIndex;
      pingIndex++;
    }
  }
};

export const getLastTrackPingTime = (tracks: any[]) => {
  let lastTrack = tracks[tracks.length - 1];
  let greatestPingTime = 0;

  for (let positionIndex in lastTrack.track) {
    if (lastTrack.track[positionIndex][3] > greatestPingTime) {
      greatestPingTime = lastTrack.track[positionIndex][3];
    }
  }

  return greatestPingTime;
};

export const collectTrackDataFromGeoJson = (trackData, markData) => {
  const tracks: any[] = [];

  trackData.default.features.forEach((boatFeature) => {
    if (boatFeature.geometry.coordinates.length > 0) {
      tracks.push({
        type: "boat",
        id: boatFeature.properties.competitor_id,
        first_ping_time: boatFeature.geometry.coordinates[0][3],
        track: boatFeature.geometry.coordinates,
        competitor_name: boatFeature.properties.competitor_name,
        competitor_sail_number: boatFeature.properties.competitor_sail_number,
      });
    }
  });

  markData.default.features.forEach((markFeature) => {
    if (markFeature.geometry.coordinates.length > 0) {
      tracks.push({
        type: "mark",
        id: markFeature.properties.mark_id,
        first_ping_time: markFeature.geometry.coordinates[0][3],
        track: markFeature.geometry.coordinates,
      });
    }
  });

  return tracks;
};

export const toSimplifiedGeoJson = (message) => {
  return {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "EPSG:3857",
      },
    },
    features: [
      {
        type: "Feature",
        geometry: message.simplified?.geometry ? message.simplified?.geometry : {},
      },
    ],
  };
};

export const simplifiedGeoJsonTrackToLastHeading = (geojson) => {
  if (!geojson.features[0].geometry.coordinates) return;

  let lastIndex = geojson.features[0].geometry.coordinates.length - 1;
  let lastPoint = geojson.features[0].geometry.coordinates[lastIndex];
  let secondLastPoint = geojson.features[0].geometry.coordinates[lastIndex - 1];

  let point1 = turf.point(lastPoint);
  let point2 = turf.point(secondLastPoint);

  let bearing = turf.bearing(point2, point1);

  return bearing;
};

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
  // result: [..., [lat, lon], ...]
  const result: any[] = [];

  for (let index = 0; index < coordinatesObject.length; index++) {
    const coord = coordinatesObject[index];
    if (coord.lat && coord.lon) result.push([coord.lat, coord.lon]);
  }

  return result;
};

export const simulateThirdParameter = (geojson) => {
  let coords: any[] = [];
  let index = 0;

  if (geojson.features[0].geometry.coordinates)
    geojson.features[0].geometry.coordinates.forEach((point) => {
      let p = [point[1], point[0], index % 360];
      index += 10;
      coords.push(p);
    });

  return coords;
};

export const simulateThirdParameterForCourse = (coordinates) => {
  let coords: any[] = [];
  let index = 0;

  if (coordinates.length > 2) {
    coordinates.forEach((point) => {
      let p = [point[1], point[0], index % 360];
      index += 10;
      coords.push(p);
    });
  } else {
    let p = [coordinates[1], coordinates[0], index % 360];
    index += 10;
    coords.push(p);
  }

  return coords;
};

export const sortTrackFirstPingTime = (tracks: any[]) => {
  tracks.sort(function (a, b) {
    if (a.first_ping_time === b.first_ping_time) return 0;
    return a.first_ping_time < b.first_ping_time ? -1 : 1;
  });
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

export const generateStartTimeFetchAndTimeToLoad = (
  retrievedTimestamps: number[],
  startTime: number,
  nextDataTime: number,
  raceLength: number
) => {
  const target = nextDataTime - startTime;
  const retrievedTsCopy = [...retrievedTimestamps];

  // If targetted time retrieved
  if (retrievedTimestamps.includes(target)) {
    // ** Find the data to check (only check for the next 30 seconds)
    const maxTime = target + 30 * 1000;
    let nextDataTimeCpy = nextDataTime;

    for (let index = target; index <= maxTime; index += 1000) {
      const dataTarget = index;

      if (!retrievedTsCopy.includes(dataTarget)) {
        nextDataTimeCpy = dataTarget + startTime;
        break;
      }

      if (index === maxTime) {
        return false;
      }
    }

    return { nextDataTime: nextDataTimeCpy, timeToLoad: 30 };
  }

  // If targetted time not retrieved,

  // ** Check if the nearest target is available
  const nearestTimetamps = findNearestRetrievedTimestamp(retrievedTimestamps, target, 1000);
  if (nearestTimetamps.previous.length) {
    return false;
  }

  // *** get the next 30 seconds
  return { timeToLoad: 30, nextDataTime };
};

export const generateVesselParticipantsLastPosition = (vesselParticipantsObject, selectedTimestamp: number, retrievedTimestamps: number[]) => {
  const vesselParticipants: VesselParticipant[] = Object.keys(vesselParticipantsObject).map(
    (key) => vesselParticipantsObject[key]
  );

  const updatedVPs = vesselParticipants.map((vP) => {
    const filteredPositions = vP.positions.filter((pos) => pos.timestamp <= selectedTimestamp);
    filteredPositions.sort((a, b) => b.timestamp - a.timestamp);

    const lastPosition = filteredPositions[0] || { lat: 0, lon: 0 };


    const isRetrievedTimestampExist = retrievedTimestamps.includes(selectedTimestamp);
    if (!isRetrievedTimestampExist) {
      // Only interpolate when no timestamp available
      const nearestPos = findNearestPositions(vP.positions, selectedTimestamp, 1000, { excludeSelectedTimestamp: true });
      const interpolatedPosition = interpolateNearestPositions(nearestPos, selectedTimestamp);
      
      if (interpolatedPosition) {
        lastPosition.lat = interpolatedPosition.lat;
        lastPosition.lon = interpolatedPosition.lon;
      }
    }

    const currentCoordinateForHeading = [lastPosition.lon || 0, lastPosition.lat || 0];
    const previousCoordinateForHeading =
      filteredPositions[1]?.lon && filteredPositions[1]?.lat
        ? [filteredPositions[1].lon, filteredPositions[1].lat]
        : currentCoordinateForHeading;
    const heading = generateLastHeading(previousCoordinateForHeading, currentCoordinateForHeading);
    lastPosition.heading = heading;

    return {
      ...vP,
      positions: filteredPositions,
      lastPosition,
    };
  });

  return updatedVPs;
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

export const findNearestPositions = (
  positions: VesselParticipantPosition[],
  selectedTimestamp: number,
  rangeLimit: number,
  opt: any = {}
) => {
  let previousPos = positions.filter((pos) => {
    return pos.timestamp >= selectedTimestamp - rangeLimit && pos.timestamp <= selectedTimestamp;
  });

  previousPos.sort((a, b) => a.timestamp - b.timestamp);

  let nextPos = positions.filter((pos) => {
    return pos.timestamp >= selectedTimestamp && pos.timestamp <= selectedTimestamp + rangeLimit;
  });

  nextPos.sort((a, b) => a.timestamp - b.timestamp);

  if (opt?.excludeSelectedTimestamp) {
    previousPos = previousPos.filter((pos) => pos.timestamp !== selectedTimestamp);
    nextPos = nextPos.filter((pos) => pos.timestamp !== selectedTimestamp);
  }

  return { previous: previousPos, next: nextPos };
};

export const interpolateNearestPositions = (
  nearestPositions: VesselParitipantNearestPositions,
  selectedTimestamp: number
) => {
  // If we could find the previous and the next position
  // example:
  // nearestPosition: [5, 6] and the selectedTimeStamp: 5.5

  if (nearestPositions.previous.length && nearestPositions.next.length) {
    const mostPreviousPos = nearestPositions.previous[nearestPositions.previous.length - 1];

    const earliestNext = nearestPositions.next[0];

    const gap = {
      timestamp: earliestNext.timestamp - mostPreviousPos.timestamp,
      lat: earliestNext.lat - mostPreviousPos.lat,
      lon: earliestNext.lon - mostPreviousPos.lon,
    };

    const normalizedTs = selectedTimestamp - mostPreviousPos.timestamp;
    const interpolatedLat = (normalizedTs / gap.timestamp) * gap.lat;
    const interpolatedLon = (normalizedTs / gap.timestamp) * gap.lon;

    return { lat: interpolatedLat + mostPreviousPos.lat, lon: interpolatedLon + mostPreviousPos.lon };
  }

  return false;
};

export const checkIsForcedToInstallAppOnMobile = (source) => {
  const allowedWebviewOnMobile = ['KWINDOO', 'RACEQS', 'TACKTRACKER', 'YACHTBOT', 'GEOVOILE', 'ESTELA', 'BLUEWATER'];
  if (allowedWebviewOnMobile.includes(source)) {
    return false;
  }

  return true;
}