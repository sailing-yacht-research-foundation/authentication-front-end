import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import { useMap } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import { PlayerInfo } from "./PlayerInfo";
import {
  simplifiedGeoJsonTrackToLastHeading,
  simulateThirdParameter,
  simulateThirdParameterForCourse,
  toSimplifiedGeoJson,
} from "utils/race/race-helper";
import { useDispatch, useSelector } from "react-redux";
import { usePlaybackSlice } from "./slice";
import { selectElapsedTime, selectRaceLength } from "./slice/selectors";
import MarkIcon from "../assets/mark.svg";

require("leaflet.boatmarker");
require("leaflet-hotline");

const objectType = {
  boat: "boat",
  mark: "mark",
  course: "course",
  leg: "leg",
};

const geometryType = {
  line: "LineString",
  point: "Point",
};

export const StreamingRaceMap = (props) => {
  const { emitter } = props;
  const dispatch = useDispatch();

  const map = useMap();
  const { actions } = usePlaybackSlice();

  const elapsedTime = useRef(0);
  const raceStatus = useRef<any>({
    boats: {},
    isMarkersAttached: false,
    isParticipantsDataAvailable: false,
    zoomedToRaceLocation: false,
  });

  const playbackElapsedTime = useSelector(selectElapsedTime);

  const raceLength = useSelector(selectRaceLength);

  useEffect(() => {
    initializeMapView();
    const { current } = raceStatus;

    if (emitter) {
      emitter.on("ping", (participants) => {
        if (!participants?.length) return;
        else
          raceStatus.current = {
            ...current,
            isParticipantsDataAvailable: true,
          };

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
    }
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
      } catch (e) {}
    });
  };

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
        minZoom: 0,
        id: "jweisbaum89/cki2dpc9a2s7919o8jqyh1gss",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "your.mapbox.access.token",
      }
    ).addTo(map);
  };

  return <></>;
};
