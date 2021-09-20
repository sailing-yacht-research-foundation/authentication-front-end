import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import { useMap } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import { PlayerInfo } from "./PlayerInfo";
import {
  formatCoordinatesObjectToArray,
  generateLastArray,
} from "utils/race/race-helper";

require("leaflet.boatmarker");
require("leaflet-hotline");

const objectType = {
  boat: "boat",
  mark: "mark",
  course: "course",
  leg: "leg",
};

export const StreamingRaceMap = (props) => {
  const { emitter } = props;

  const map = useMap();

  const raceStatus = useRef<any>({
    boats: {}, // layers
    legs: {}, // layers
    isMarkersAttached: false,
    isLegsAttached: false,
    isParticipantsDataAvailable: false,
    zoomedToRaceLocation: false,
  });

  useEffect(() => {
    initializeMapView();
    const { current } = raceStatus;

    if (emitter) {
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

      emitter.on('leg-update', (participants) => {
        if (!participants.length) return;
        const participantsCpy = [...participants];

        // Legs
        if (current.isLegsAttached) {
          _removeLegLayersFromMap(current.legs);
          current.isLegsAttached = false;
        };

        // Generate legs coordinate
        const legsData = {};
        participantsCpy.forEach((participant) => {
          const generatedCoordinates = generateLastArray(participant.positions, 80);
          const formattedCoordinates = formatCoordinatesObjectToArray(generatedCoordinates);
          legsData[participant.id] = {
            coordinates: formattedCoordinates,
            color: participant.color
          };
        });

        // Attach legs to map
        if (!current.isLegsAttached) {
          const newLegs = {};
          Object.keys(legsData).forEach((key) => {
            const { coordinates, color } = legsData[key];
            newLegs[key] = _attachPolylineToMap(coordinates, color);
          });

          current.legs = newLegs;
          current.isLegsAttached = true;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _initializeBoatMarker = (participant) => {
    if (participant.deviceType === objectType.boat) {
      return L.boatMarker(
        [
          participant?.lastPosition?.lat || 0,
          participant?.lastPosition?.lon || 0,
        ],
        {
          color: participant.color, // color of the boat
          idleCircle: false, // if set to true, the icon will draw a circle
        }
      )
        .bindPopup(
          ReactDOMServer.renderToString(
            <PlayerInfo playerData={participant.participant} />
          )
        )
        .openPopup();
    }
  };

  const _removeAllRaceObjectLayers = (participants) => {
    participants.forEach((participant) => {
      try {
        map.removeLayer(participant.id);
      } catch (e) { }
    });
  };

  const _removeLegLayersFromMap = (legLayers) => {
    Object.keys(legLayers).forEach(key => {
      map.removeLayer(legLayers[key]);
    });
  }

  const _initLayerAndSetLocationAndHeadingForBoat = (
    participants,
    boatMarkers,
    boats
  ) => {
    const localBoats = { ...boats };

    participants.forEach((participant) => {
      const selectedBoatMarker = boatMarkers.filter(
        (bM) => bM.id === participant.id
      );
      if (!localBoats[participant.id])
        localBoats[participant.id] = {
          layer: selectedBoatMarker[0].layer,
          id: selectedBoatMarker[0].id,
        };
      else {
        localBoats[participant.id].layer.setLatLng(
          new L.LatLng(
            participant.lastPosition?.lat || 0,
            participant.lastPosition?.lon || 0
          )
        );

        localBoats[participant.id].layer.setHeading(participant.lastPosition?.heading || 0)
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

  const _attachPolylineToMap = (coordinates, color) => {
    return L.polyline(coordinates).setStyle({
      weight: 1,
      color
    }).addTo(map);
  }

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
          '<a href="https://www.github.com/sailing-yacht-research-foundation"><img src="https://syrf.io/wp-content/themes/syrf/assets/svg/icon-github.svg"></img></a>',
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
