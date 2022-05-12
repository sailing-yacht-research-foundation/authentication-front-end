import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import { useMap } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import copy from "copy-to-clipboard";
import { message } from "antd";
import { formatCoordinatesObjectToArray, generateLastArray, normalizeSequencedGeometries } from "utils/race/race-helper";
import { MappedCourseGeometrySequenced } from "types/CourseGeometry";

import { PlayerInfo } from "./PlayerInfo";
import MarkIcon from "../assets/mark.svg";
import { ReactComponent as BoatIcon } from "../assets/ic-boat.svg";
import { NormalizedRaceLeg } from "types/RaceLeg";
import { MarkerInfo } from "./MarkerInfo";
import { RaceEmitterEvent } from "utils/constants";
import styled from "styled-components";
import { VscReactions } from "react-icons/vsc";
import { usePlaybackSlice } from "./slice";
import { useDispatch, useSelector } from "react-redux";
import { selectCompetitionUnitDetail, selectPlaybackType } from "./slice/selectors";
import { PlaybackTypes } from "types/Playback";
import { selectIsAuthenticated } from "app/pages/LoginPage/slice/selectors";
import moment from "moment";

require("leaflet-hotline");
require("leaflet-rotatedmarker");

const objectType = {
  boat: "boat",
  mark: "mark",
  course: "course",
  leg: "leg",
  point: 'point',
  lineString: 'linestring',
  line: 'line',
  polygon: 'polygon',
  polyline: 'polyline'
};

const colors = {
  WHITE: '#fff',
  BLACK: '#000',
  RED: '#ff0000',
  GRAY: '#808080'
}

const NO_PING_TIMEOUT = 60000;

export const RaceMap = (props) => {
  const { emitter } = props;

  const { actions } = usePlaybackSlice();

  const dispatch = useDispatch();

  const playbackType = useSelector(selectPlaybackType);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);

  const map = useMap();

  const raceStatus = useRef<any>({ // for globally manage all markers and race states.
    boats: {}, // layers
    tracks: {}, // layers
    courses: {}, // layers
    legs: {}, // layets
    isTracksAttached: false,
    isParticipantsDataAvailable: false,
    zoomedToRaceLocation: false,
    courseData: [] /// sequenced courses raw data.
  });

  useEffect(() => {
    initializeMapView();
    const { current } = raceStatus;

    if (emitter) {
      // Zoom to specific race location
      emitter.on(RaceEmitterEvent.ZOOM_TO_LOCATION, () => {
        _zoomToRaceLocation(current)
      });

      // Render the boat
      emitter?.on(RaceEmitterEvent.PING, (participants) => {
        _updateBoats(participants, current);
        _updateTrack(participants, current);
      });

      // Update the courses
      emitter.on(RaceEmitterEvent.RENDER_SEQUENCED_COURSE, (sequencedCourses: MappedCourseGeometrySequenced[]) => {
        current.courseData = JSON.parse(JSON.stringify(sequencedCourses)); // save this for later update.
        _drawCourse(sequencedCourses);
      });

      emitter.on(RaceEmitterEvent.UPDATE_COURSE_MARK, (courseMarkData) => {
        _updateCourseMark(courseMarkData);
      });

      emitter.on(RaceEmitterEvent.REMOVE_PARTICIPANT, (id) => {
        _removeVesselParticipant(id);
      })

      emitter.on(RaceEmitterEvent.RENDER_REGS, (raceLegs: NormalizedRaceLeg[]) => {
        _updateLegs(raceLegs);
      });

      emitter.on(RaceEmitterEvent.ZOOM_TO_PARTICIPANT, (participant) => {
        _zoomToParticipant(participant);
      });

      emitter.on(RaceEmitterEvent.UPDATE_COURSE, (courses: MappedCourseGeometrySequenced) => {
        current.courseData = JSON.parse(JSON.stringify(courses));
        _updateCourse(courses);
      });

      emitter.on(RaceEmitterEvent.OCS_DETECTED, _changeBoatColorToRedIfOCSDetected);

      emitter.on(RaceEmitterEvent.UPDATE_BOAT_COLOR, _updateBoatColorIfPingNotReceived);

      emitter.on(RaceEmitterEvent.CHANGE_BOAT_COLOR_TO_GRAY, _changeBoatColorToGray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _changeBoatColorToGray = (vesselParticipantId: string) => {
    const { current } = raceStatus;
    const boats = current.boats;
    if (!boats[vesselParticipantId]) return;
    // There is a listener that checks for last time the boat pings. When the boat didn't ping for more than 60secs it would be grayed out.
    // Line 132 makes the boat turn gray immediately.
    // please check _updateBoatColorIfPingNotReceived and _initLayerAndSetLocationAndHeadingForBoat to understand the flow.
    boats[vesselParticipantId].lastPing = Date.now() - NO_PING_TIMEOUT;
    boats[vesselParticipantId].layer._icon.firstElementChild.style.fill = colors.GRAY;
  }

  const _changeBoatColorToRedIfOCSDetected = (vesselParticipantId: string) => {
    const { current } = raceStatus;
    const boats = current.boats;
    if (!boats[vesselParticipantId]) return;
    boats[vesselParticipantId].layer._icon.firstElementChild.style.fill = colors.RED;
    boats[vesselParticipantId].ocsReceivedAt = Date.now();
  }

  const _updateBoatColorIfPingNotReceived = () => {
    const { current } = raceStatus;
    const boats = current.boats;
    Object.keys(boats).forEach(key => {
      if (!boats[key]) return;

      const noPingReceivedFromTheBoatAfter1Minute = moment.duration(moment().diff(moment(boats[key].lastPing))).asMilliseconds() > NO_PING_TIMEOUT;

      if (noPingReceivedFromTheBoatAfter1Minute) {
        boats[key].layer._icon.firstElementChild.style.fill = colors.GRAY;
      } else {
        const ocsReceivedLessThan10Seconds = boats[key].ocsReceivedAt && moment.duration(moment().diff(moment(boats[key].ocsReceivedAt))).asSeconds() < 10;

        if (ocsReceivedLessThan10Seconds) {
          return;
        } else {
          delete boats[key]['ocsReceivedAt'];
        }

        boats[key].layer._icon.firstElementChild.style.fill = boats[key].originalColor;
      }
    });
  }

  const _updateCourse = (courseGeometries) => {
    _drawCourse(courseGeometries);
  }

  const _drawCourse = (sequencedCourses) => {
    _attachCoursesToMap(_prepareCourseData(sequencedCourses)); // Attach prepared course data to map
  }

  const _zoomToParticipant = (participant) => {
    const boat = raceStatus?.current?.boats[participant?.id];

    if (boat && boat?.layer instanceof L.Marker) {
      let markers = document.querySelectorAll<HTMLElement>('.leaflet-marker-pane > *');
      markers.forEach(marker => {
        marker.style.transition = 'none';
      });
      map.setView(boat?.layer.getLatLng(), 20);
      setTimeout(() => {
        markers.forEach(marker => {
          marker.style.transition = 'transform .3s linear';;
        });
      }, 50);
    }
  }

  const _prepareCourseData = (sequencedCourses) => {
    const coursesData = {};
    const currentCourses = raceStatus.current.courses;

    if (!sequencedCourses.length) return;

    // Remove course layers
    if (Object.keys(currentCourses).length) {
      _removeLayersFromMap(currentCourses);
      raceStatus.current.courses = {};
    }

    sequencedCourses.forEach((sequencedCourse) => {
      if (sequencedCourse.coordinates.length === 0) return;

      const courseGeometryType = String(sequencedCourse.geometryType).toLowerCase();
      if (courseGeometryType === objectType.point) {
        const coordinate = sequencedCourse.coordinates[0];
        coursesData[sequencedCourse.id || ""] = _initPointMarker({
          coordinate: { lat: coordinate[0], lon: coordinate[1] },
          id: sequencedCourse.id,
          name: sequencedCourse?.properties?.name
        });
      }

      if ([objectType.line, objectType.lineString, objectType.polyline].includes(courseGeometryType)) {
        coursesData[sequencedCourse.id || ""] = _initPolyline({
          coordinates: sequencedCourse.coordinates,
          color: colors.BLACK,
          weight: 3,
          name: sequencedCourse?.properties?.name,
          id: sequencedCourse.id,
        });
      }

      if (courseGeometryType === objectType.polygon) {
        coursesData[sequencedCourse.id || ""] = _initPolygon({
          coordinates: sequencedCourse.coordinates,
          color: colors.BLACK,
          weight: 3,
          name: sequencedCourse?.properties?.name,
          id: sequencedCourse.id,
        });
      }
    });

    return coursesData;
  }

  const _updateLegs = (raceLegs) => {
    const { current } = raceStatus;
    const legs = {};

    if (Object.keys(current.legs)?.length) {
      _removeTrackLayersFromMap(current.legs);
    }

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
  }

  const _removeOrphanedBoatsIfExist = (boatLayers, participants) => {
    Object.keys(boatLayers).forEach(boatId => {
      if (!participants.map(p => p.id).includes(boatId)) {
        const boatLayer = boatLayers[boatId]?.layer;
        if (boatLayer && boatLayer instanceof L.Marker) {
          map.removeLayer(boatLayers[boatId].layer);
          delete boatLayers[boatId];
        }
      }
    });
  }

  const _updateBoats = (participants, current) => {
    if (!participants?.length) return; // no participants, no render.
    // Zoom to race location, on first time update.
    _removeOrphanedBoatsIfExist(current.boats, participants);

    if (!current.zoomedToRaceLocation) {
      current.zoomedToRaceLocation = _zoomToRaceLocation(current);
    }

    // Map the boat markers
    if (!!participants?.length) {
      const initializedBoatMarkers = participants.map((participant) => ({
        id: participant.id,
        layer: _initializeBoatMarker(participant, current.boats?.[participant.id]?.layer),
      }));
      current.boats = _initLayerAndSetLocationAndHeadingForBoat(
        participants,
        initializedBoatMarkers,
        current.boats
      );

      current.boats = _attachBoatsToMap(current.boats);
    }
  }

  const _updateTrack = (participants, current) => {
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
  }

  const _canSendKudos = () => {
    return !competitionUnitDetail.calendarEvent?.isPrivate // event is not a track now event
      && !competitionUnitDetail.calendarEvent.isSimulation
      && playbackType === PlaybackTypes.STREAMINGRACE
      && isAuthenticated;
  }

  const _initializeBoatMarker = (participant, layer) => {
    if (layer) {
      const currentCoordinate = {
        lat: participant?.lastPosition?.lat || 0,
        lon: participant?.lastPosition?.lon || 0,
      };

      const popupContent = ReactDOMServer.renderToString(
        <PlayerInfo playerData={participant.participant} coordinate={currentCoordinate} />
      );
      layer._popup.setContent(popupContent);

      return;
    }

    if (participant.deviceType === objectType.boat) {
      const currentCoordinate = {
        lat: participant?.lastPosition?.lat || 0,
        lon: participant?.lastPosition?.lon || 0,
      };

      const popupContent = ReactDOMServer.renderToString(
        <PlayerInfo playerData={participant.participant} coordinate={currentCoordinate} />
      );

      const participantColor = participant.color;

      const styleSetup = {
        stroke: colors.WHITE,
        fill: participantColor,
        strokeWidth: 25,
        width: "18px",
        height: "36px",
        marginLeft: `-9px`,
        marginTop: "-8px",
      };

      const svgStyle = {
        width: "18px",
        height: "36px",
      };

      const renderedBoatIcon = (
        <BoatIconWrapper style={styleSetup}>
          <BoatIcon style={svgStyle} />
          {_canSendKudos() && <KudoReactionContainer className={'kudo-menu'}>
            <KudoReactionMenuButton />
          </KudoReactionContainer>}
        </BoatIconWrapper>
      );

      const markerIcon = L.divIcon({
        labelAnchor: [0, 0],
        popupAnchor: [8, -8],
        iconAnchor: [0, 0],
        iconSize: [0, 0],
        html: ReactDOMServer.renderToString(renderedBoatIcon),
      });

      const marker = L.marker([currentCoordinate.lat, currentCoordinate.lon], {
        icon: markerIcon,
        rotationOrigin: "center center",
      }).bindPopup(popupContent);

      marker.on("click", function (e) {
        marker.openPopup();

        if (_canSendKudos())
          _setVesselParticipantIdAndShowKudosMenu(participant);

        const coordinate = {
          lat: e.latlng.lat,
          lon: e.latlng.lng,
        };

        message.success("Coordinate copied!");
        copy(`coordinate [lat, lon]: [${coordinate.lat}, ${coordinate.lon}]`);
      });

      marker.on("mouseover", function (e) {
        marker.openPopup();
      });

      marker.on("mouseout", function () {
        marker.closePopup();
      });

      return marker;
    }
  };

  const _setVesselParticipantIdAndShowKudosMenu = (vesselParticipant) => {
    dispatch(actions.setVesselParticipantIdForShowingKudos(vesselParticipant));
  }

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
      const participantLastPosition = participant.lastPosition;
      const selectedBoatMarker = boatMarkers.filter((bM) => bM.id === participant.id);

      if (!localBoats[participant.id])
        localBoats[participant.id] = {
          layer: selectedBoatMarker[0].layer,
          id: selectedBoatMarker[0].id,
          originalColor: participant.color,
          lastPing: Date.now(),
          lastPosition: participantLastPosition,
        };
      else {
        const boatPosition = localBoats[participant.id].lastPosition;

        if (boatPosition.lon !== participantLastPosition.lon && // update boat last position and lastPing base on the lon lat different.
          boatPosition.lat !== participantLastPosition.lat) {
          localBoats[participant.id].lastPosition = participantLastPosition;
          localBoats[participant.id].lastPing = Date.now();
        }

        localBoats[participant.id].layer.setLatLng(
          new L.LatLng(participantLastPosition?.lat || 0, participantLastPosition?.lon || 0)
        );

        const currentHeading = participantLastPosition?.heading || 0;
        localBoats[participant.id].layer.setRotationAngle(currentHeading || 0);
      }
    });

    return localBoats;
  };

  const _attachBoatsToMap = (boats) => {
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
    if (!courses) return;
    raceStatus.current.courses = courses;
    Object.keys(courses).forEach((k) => {
      courses[k].addTo(map);
    });
  };

  const _updateCourseMark = (courseMarkData) => {
    const { raceData, lat, lon } = courseMarkData;
    const pointIdToUpdate = raceData?.coursePointId;
    let sequencedGeometries = raceStatus.current.courseData;

    sequencedGeometries.forEach(geometry => {
      geometry?.points?.some(point => {
        if (point.id === pointIdToUpdate) {
          point.position = [lat, lon];
          return true;
        }
        return false;
      })
    });

    _drawCourse(normalizeSequencedGeometries(sequencedGeometries));
  }

  const _removeVesselParticipant = (vesselParticipantId) => {
    const boat = raceStatus?.current?.boats[vesselParticipantId];
    if (!boat) return;

    if (boat.layer instanceof L.Marker) {
      map.removeLayer(boat.layer);
      delete raceStatus?.current?.boats[vesselParticipantId];
    }
  }

  const _attachPolylineToMap = (coordinates, color, weight = 1) => {
    return L.polyline(coordinates)
      .setStyle({
        weight,
        color,
      })
      .addTo(map);
  };

  const _initPolyline = ({ coordinates, color, weight = 1, id, name }) => {
    const popupContent = ReactDOMServer.renderToString(<MarkerInfo name={name} identifier={id} />);
    const marker = L.polyline(coordinates)
      .setStyle({
        weight,
        color,
      })
      .bindPopup(popupContent)
      .addTo(map);

    marker.on("click", function (e) {
      marker.openPopup();
    });

    marker.on("mouseover", function (e) {
      marker.openPopup();
    });

    marker.on("mouseout", function () {
      marker.closePopup();
    });

    return marker;
  };

  const _initPolygon = ({ coordinates, color, weight = 1, id, name }) => {
    const popupContent = ReactDOMServer.renderToString(<MarkerInfo name={name} identifier={id} />);
    const marker = L.polygon(coordinates)
      .setStyle({
        weight,
        color,
      })
      .bindPopup(popupContent)
      .addTo(map);

    marker.on("click", function (e) {
      marker.openPopup();
    });

    marker.on("mouseover", function (e) {
      marker.openPopup();
    });

    marker.on("mouseout", function () {
      marker.closePopup();
    });

    return marker;
  };

  const _initPointMarker = (data) => {
    const { coordinate, id, name } = data;

    const popupContent = ReactDOMServer.renderToString(<MarkerInfo coordinate={coordinate} name={name} identifier={id} />);

    const marker = L.marker([coordinate.lat, coordinate.lon], {
      icon: new L.icon({
        iconUrl: MarkIcon,
        iconSize: [40, 40],
        iconAnchor: [14, 32],
        popupAnchor: [5, -15]
      }),
    })
      .bindPopup(popupContent)
      .addTo(map);

    marker.on("click", function (e) {
      marker.openPopup();

      const coordinate = {
        lat: e.latlng.lat,
        lon: e.latlng.lng,
      };

      message.success("Coordinate copied!");
      copy(`coordinate [lat, lon]: [${coordinate.lat}, ${coordinate.lon}]`);
    });

    marker.on("mouseover", function (e) {
      marker.openPopup();
    });

    marker.on("mouseout", function () {
      marker.closePopup();
    });

    return marker;
  };

  const _zoomToRaceLocation = (current) => {
    // first we get all markers on the map
    const boatLayers = Object.keys(current.boats).map((key) => {
      if (current?.boats[key]?.layer)
        return current?.boats[key]?.layer;
      return null;
    }).filter(Boolean);

    const legsLayers = Object.keys(current.legs).map((key) => {
      return current?.legs[key];
    }).filter(Boolean);

    const trackLayers = Object.keys(current.tracks).map((key) => {
      return current?.tracks[key];
    }).filter(Boolean);

    const layers = [...boatLayers, ...legsLayers, ...trackLayers];

    // then if we have the markers, we zoom the map to fit all of them.
    if (layers.length > 0) {
      const group = new L.featureGroup(layers);
      map.fitBounds(group.getBounds());
      return true;
    }

    return false;
  };

  const initializeMapView = () => {
    new L.TileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`,
      {
        attribution:
          '<a href="https://www.github.com/sailing-yacht-research-foundation"><img style="width: 15px; height: 15px;" src="/favicon.ico"></img></a>',
        maxZoom: 19,
        minZoom: 1,
        id: "jweisbaum89/cki2dpc9a2s7919o8jqyh1gss",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "your.mapbox.access.token",
      }
    ).addTo(map);

    map.on('zoomstart', () => {
      let markers = document.querySelectorAll<HTMLElement>('.leaflet-marker-pane > *');
      markers.forEach(marker => {
        marker.style.transition = 'none';
      })
    });

    map.on('zoomend', () => {
      let markers = document.querySelectorAll<HTMLElement>('.leaflet-marker-pane > *');
      setTimeout(() => {
        markers.forEach(marker => {
          marker.style.transition = 'transform .3s linear';
        })
      }, 50);
    })
  };

  return <></>;
};

const KudoReactionContainer = styled.div`
  position: absolute;
  display: none;
  transform: none !important;
`;

const BoatIconWrapper = styled.div`
  position: relative;
  &:hover ${KudoReactionContainer} {
    display: block;
  }
`;

const KudoReactionMenuButton = styled(VscReactions)`
  color: #000;
  background: #fff;
  border-radius: 10px;
  font-size: 27px;
  padding: 3px;
`;