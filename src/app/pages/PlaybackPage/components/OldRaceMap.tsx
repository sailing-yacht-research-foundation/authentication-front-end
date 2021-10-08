import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import { useMap } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import { PlayerInfo } from "./PlayerInfo";
import { formatCoordinatesObjectToArray, generateLastArray } from "utils/race/race-helper";
import { MappedCourseGeometrySequenced } from "types/CourseGeometry";

import MarkIcon from "../assets/mark.svg";
import { NormalizedRaceLeg } from "types/RaceLeg";

require("leaflet.boatmarker");
require("leaflet-hotline");

const objectType = {
  boat: "boat",
  mark: "mark",
  course: "course",
  leg: "leg",
  point: "point",
  line: "line",
};

export const OldRaceMap = (props) => {
  const { emitter } = props;

  const map = useMap();

  const raceStatus = useRef<any>({
    boats: {}, // layers
    tracks: {}, // layers
    courses: {}, // layers
    legs: {}, // layets
    isMarkersAttached: false,
    isTracksAttached: false,
    isParticipantsDataAvailable: false,
    zoomedToRaceLocation: false,
  });

  useEffect(() => {
    initializeMapView();
    const { current } = raceStatus;

    if (emitter) {
      // Zoom to specific race location
      emitter.on("zoom-to-location", (lastPosition: { position: number[]; pingTime: number }) => {
        map.setView(
          {
            lat: lastPosition.position[1],
            lng: lastPosition.position[0],
          },
          16.4
        );
      });

      // Render the boat
      emitter.on("ping", (participants) => {
        if (!participants?.length) return;

        // Zoom to location
        if (!current.zoomedToRaceLocation) {
          current.zoomedToRaceLocation = _zoomToRaceLocation(participants[0], current);
        }

        // Remove all race object layers
        if (current.isMarkersAttached) {
          _removeAllRaceObjectLayers(participants);
          current.isMarkersAttached = false;
        }

        // Map the boat markers
        if (!!participants?.length) {
          const initializedBoatMarkers = participants.map((participant) => ({
            id: participant.id,
            layer: _initializeBoatMarker(participant),
          }));
          current.boats = _initLayerAndSetLocationAndHeadingForBoat(
            participants,
            initializedBoatMarkers,
            current.boats
          );

          current.boats = _attachMarkersToMap(current.boats);
          current.isMarkersAttached = true;
        }
      });

      // Update the track
      emitter.on("track-update", (participants) => {
        if (!participants.length) return;
        const participantsCpy = [...participants];

        // Tracks
        if (current.isTracksAttached) {
          _removeTrackLayersFromMap(current.tracks);
          current.isTracksAttached = false;
        }

        // Generate tracks coordinate
        const tracksData = {};
        participantsCpy.forEach((participant) => {
          const generatedCoordinates = generateLastArray(participant.positions, participant.positions.length);
          const formattedCoordinates = formatCoordinatesObjectToArray(generatedCoordinates);
          tracksData[participant.id] = {
            coordinates: formattedCoordinates,
            color: participant.color,
          };
        });

        // Attach tracks to map
        if (!current.isTracksAttached) {
          const newTracks = {};
          Object.keys(tracksData).forEach((key) => {
            const { coordinates, color } = tracksData[key];
            newTracks[key] = _attachPolylineToMap(coordinates, color);
          });

          current.tracks = newTracks;
          current.isTracksAttached = true;
        }
      });

      // Update the courses
      emitter.on("sequenced-courses-update", (sequencedCourses: MappedCourseGeometrySequenced[]) => {
        if (!sequencedCourses.length) return;
        const currentCourses = raceStatus.current.courses;

        // Remove course layers
        if (Object.keys(currentCourses).length) {
          _removeLayersFromMap(currentCourses);
          raceStatus.current.courses = {};
        }

        const coursesData = {};
        sequencedCourses.forEach((sequencedCourse) => {
          if (sequencedCourse.geometryType === objectType.point) {
            const coordinate = sequencedCourse.coordinates[0];
            coursesData[sequencedCourse.id || ""] = _initPointMarker({ lat: coordinate[1], lon: coordinate[0] });
          }

          if (sequencedCourse.geometryType === objectType.line) {
            const switchedCoordinates = sequencedCourse.coordinates.map((coordinate) => {
              return [coordinate[1], coordinate[0]];
            });
            coursesData[sequencedCourse.id || ""] = _initPolyline(switchedCoordinates, "#000000", 3);
          }
        });

        // Attach to map
        _attachCoursesToMap(coursesData);
      });

      emitter.on("render-legs", (raceLegs: NormalizedRaceLeg[]) => {
        const { current } = raceStatus;

        if (Object.keys(current.legs)?.length) {
          _removeTrackLayersFromMap(current.legs);
        }

        const legs = {};

        raceLegs.forEach((raceLeg) => {
          raceLeg.legs.forEach((leg) => {
            legs[`${leg.legId}-${raceLeg.vesselParticipantId}`] = _attachPolylineToMap(
              leg.coordinates,
              raceLeg.color,
              3
            );
          });
        });

        current.legs = legs;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _initializeBoatMarker = (participant) => {
    if (participant.deviceType === objectType.boat) {
      return L.boatMarker([participant?.lastPosition?.lat || 0, participant?.lastPosition?.lon || 0], {
        color: participant.color, // color of the boat
        idleCircle: false, // if set to true, the icon will draw a circle
      })
        .bindPopup(ReactDOMServer.renderToString(<PlayerInfo playerData={participant.participant} />))
        .openPopup();
    }
  };

  const _removeAllRaceObjectLayers = (participants) => {
    participants.forEach((participant) => {
      try {
        map.removeLayer(participant.id);
      } catch (e) {}
    });
  };

  const _removeTrackLayersFromMap = (legLayers) => {
    Object.keys(legLayers).forEach((key) => {
      map.removeLayer(legLayers[key]);
    });
  };

  const _removeLayersFromMap = (layers) => {
    Object.keys(layers).forEach((key) => {
      map.removeLayer(layers[key]);
    });
  };

  const _initLayerAndSetLocationAndHeadingForBoat = (participants, boatMarkers, boats) => {
    const localBoats = { ...boats };

    participants.forEach((participant) => {
      const selectedBoatMarker = boatMarkers.filter((bM) => bM.id === participant.id);
      if (!localBoats[participant.id])
        localBoats[participant.id] = {
          layer: selectedBoatMarker[0].layer,
          id: selectedBoatMarker[0].id,
        };
      else {
        localBoats[participant.id].layer.setLatLng(
          new L.LatLng(participant.lastPosition?.lat || 0, participant.lastPosition?.lon || 0)
        );

        localBoats[participant.id].layer.setHeading(participant.lastPosition?.heading || 0);
      }
    });

    return localBoats;
  };

  const _attachMarkersToMap = (boats) => {
    const localBoats = { ...boats };
    Object.keys(localBoats).forEach((k) => {
      if (!localBoats[k].attached) {
        localBoats[k].layer.addTo(map);
        localBoats[k].attached = true;
      }
    });

    return localBoats;
  };

  const _attachCoursesToMap = (courses) => {
    Object.keys(courses).forEach((k) => {
      courses[k].addTo(map);
    });
  };

  const _attachPolylineToMap = (coordinates, color, weight = 1) => {
    return L.polyline(coordinates)
      .setStyle({
        weight,
        color,
      })
      .addTo(map);
  };

  const _initPolyline = (coordinates, color, weight = 1) => {
    return L.polyline(coordinates)
      .setStyle({
        weight,
        color,
      })
      .addTo(map);
  };

  const _initPointMarker = (coordinates) => {
    return L.marker([coordinates.lat, coordinates.lon], {
      icon: new L.icon({
        iconUrl: MarkIcon,
        iconSize: [40, 40],
        iconAnchor: [14, 32],
      }),
    }).addTo(map);
  };

  const _zoomToRaceLocation = (participant, mapVariable) => {
    if (!mapVariable.zoomedToRaceLocation) {
      if (!participant?.lastPosition?.lat || !participant?.lastPosition?.lon) return false;
      map.setView(
        {
          lat: participant.lastPosition.lat,
          lng: participant.lastPosition.lon,
        },
        18
      );
      return true;
    }
  };

  const initializeMapView = () => {
    new L.TileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`,
      {
        attribution:
          '<a href="https://www.github.com/sailing-yacht-research-foundation"><img style="width: 15px; height: 15px;" src="/favicon.ico"></img></a>',
        maxZoom: 18,
        minZoom: 13,
        id: "jweisbaum89/cki2dpc9a2s7919o8jqyh1gss",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "your.mapbox.access.token",
      }
    ).addTo(map);
  };

  return <></>;
};