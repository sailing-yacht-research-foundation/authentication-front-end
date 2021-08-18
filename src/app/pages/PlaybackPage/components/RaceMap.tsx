import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import { useMap } from 'react-leaflet';
import ReactDOMServer from 'react-dom/server';
import { PlayerInfo } from './PlayerInfo';
import {
    simplifiedGeoJsonTrackToLastHeading,
    simulateThirdParameter,
    simulateThirdParameterForCourse,
    toSimplifiedGeoJson
} from 'utils/race/race-helper';
import { useDispatch, useSelector } from 'react-redux';
import { usePlaybackSlice } from './slice';
import { selectElapsedTime, selectRaceLength } from './slice/selectors';
import MarkIcon from '../assets/mark.svg';

require("leaflet.boatmarker");
require('leaflet-hotline');

const objectType = {
    boat: 'boat',
    mark: 'mark',
    course: 'course',
    leg: 'leg'
}

const geometryType = {
    line: 'LineString',
    point: 'Point'
}

export const RaceMap = (props) => {

    const { eventEmitter, race } = props;

    const map = useMap();

    const dispatch = useDispatch();

    const { actions } = usePlaybackSlice();

    const elapsedTime = useRef(0);

    const playbackElapsedTime = useSelector(selectElapsedTime);

    const raceLength = useSelector(selectRaceLength);

    useEffect(() => {
        elapsedTime.current = playbackElapsedTime;
    }, [playbackElapsedTime]);

    useEffect(() => {
        initializeMapView();

        const mapVariable: any = {
            deviceIdsToLayers: {},
            deviceIdsToBoatMarkers: {},
            gemetryLayers: [],
            legLayers: [],
            zoomedToRaceLocation: false,
            deviceMarker: null,
            markerAttachedToMap: false,
            deviceIdToElapsedTime: '',
            startCountingTime: false,
            updateElapesedTimeInterval: null
        }

        eventEmitter.on('geometry', function (data) {
            onCourseGeometryUpdate(data, mapVariable);
        });

        eventEmitter.on('leg-update', function (data) {
            onLegUpdate(data, mapVariable);
        });

        eventEmitter.on('ping', function (data) {
            onReceivedDevicePing(data, mapVariable);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onReceivedDevicePing = (data, mapVariable) => {
        let deviceMarker;
        let receivedMessage = JSON.parse(data);
        let deviceId = receivedMessage.deviceId;
        let json = toSimplifiedGeoJson(receivedMessage);
        let heading = simplifiedGeoJsonTrackToLastHeading(json);
        let coords = simulateThirdParameter(json);
        let boatTrackLayer = L.polyline(coords).setStyle({
            color: receivedMessage.color,
            weight: 1
        });


        _startCountingElapsedTime(mapVariable);
        _zoomToRaceLocation(receivedMessage, mapVariable);
        _removeAllRaceObjectLayers(mapVariable);
        deviceMarker = _initializeBoatAndMarkMarker(receivedMessage);
        _initLayerAndSetLocationAndHeadingForBoatAndBoatTrackAndMark(
            mapVariable,
            deviceId,
            deviceMarker,
            receivedMessage,
            boatTrackLayer,
            heading
        );
        _attachMarkersToMap(mapVariable);
    }

    const _initLayerAndSetLocationAndHeadingForBoatAndBoatTrackAndMark = (mapVariable, deviceId, deviceMarker, receivedMessage, boatTrackLayer, heading) => {
        mapVariable.deviceIdsToLayers[deviceId] = boatTrackLayer;
        if (mapVariable.deviceIdsToBoatMarkers[deviceId] === undefined) {
            mapVariable.deviceIdsToBoatMarkers[deviceId] = {
                layer: deviceMarker
            }
        } else {
            mapVariable.deviceIdsToBoatMarkers[deviceId].layer.setLatLng(new L.LatLng(receivedMessage.content.lat, receivedMessage.content.lon));
            if (receivedMessage.deviceType === objectType.boat) {
                mapVariable.deviceIdsToBoatMarkers[deviceId].layer.setHeading(heading);
            }
        }
    }

    const _removeCourseGeometryOrLegGeomtryLayersFromMap = (arrayOfLayers) => {
        arrayOfLayers.forEach((layer, index) => {
            map.removeLayer(layer);
            arrayOfLayers.splice(index, 1);
        })
    }

    const _attachGeometryLayerToMap = (coordinates, geometryLayersArray, typeOfGeometry, geometryColor) => {
        let coords = simulateThirdParameterForCourse(coordinates);
        if (typeOfGeometry === geometryType.line) {
            let geometryLineLayer = L.polyline(coords).setStyle({
                weight: 1,
                color: geometryColor
            }).addTo(map);

            geometryLayersArray.push(geometryLineLayer);
        }
    }

    const onCourseGeometryUpdate = (data, mapVariable) => {
        _removeCourseGeometryOrLegGeomtryLayersFromMap(mapVariable.gemetryLayers);

        let geometryData = JSON.parse(data);

        geometryData.geometry.forEach(geometry => {
            _attachGeometryLayerToMap(geometry.geometry?.coordinates, mapVariable.gemetryLayers, geometry.geometry?.type, 'white');
        });
    }

    const onLegUpdate = (data, mapVariable) => {
        _removeCourseGeometryOrLegGeomtryLayersFromMap(mapVariable.legLayers);

        let geometryData = JSON.parse(data);

        geometryData.legs.forEach(leg => {
            _attachGeometryLayerToMap(leg.geometry?.coordinates, mapVariable.legLayers, leg.geometry?.type, '#DC6E1E');
        });
    }

    const _attachMarkersToMap = (mapVariable) => {
        Object.keys(mapVariable.deviceIdsToLayers).forEach(k => {
            mapVariable.deviceIdsToLayers[k].addTo(map);
            if (mapVariable.deviceIdsToBoatMarkers[k].attached === undefined) {
                mapVariable.deviceIdsToBoatMarkers[k].layer.addTo(map);
                mapVariable.deviceIdsToBoatMarkers[k].attached = true;
            }
        });
    }

    const _initializeBoatAndMarkMarker = (receivedMessage,) => {
        if (receivedMessage.deviceType === objectType.boat) {
            return L.boatMarker([receivedMessage.content.lat, receivedMessage.content.lon], {
                color: receivedMessage.color, 	// color of the boat
                idleCircle: false	// if set to true, the icon will draw a circle
            }).bindPopup(
                ReactDOMServer.renderToString(<PlayerInfo playerData={receivedMessage.playerData} />)
            ).openPopup();
        } else if (receivedMessage.deviceType === objectType.mark) {
            return L.marker([receivedMessage.content.lat, receivedMessage.content.lon], {
                icon: new L.icon({
                    iconUrl: MarkIcon,
                    iconSize: [40, 40]
                })
            });
        }
    }

    const _startCountingElapsedTime = (mapVariable) => {        
        if (!mapVariable.startCountingTime) {
            mapVariable.updateElapesedTimeInterval = setInterval(() => {
                if (!race.isPlaying) {
                    clearInterval(mapVariable.updateElapesedTimeInterval);
                    mapVariable.startCountingTime = false;
                    return;
                }

                elapsedTime.current += 1000;
                dispatch(actions.setElapsedTime(elapsedTime.current));

                if (elapsedTime.current >= raceLength) {
                    race.setIsPlaying(false);
                    dispatch(actions.setElapsedTime(raceLength));
                    clearInterval(mapVariable.updateElapesedTimeInterval);
                    mapVariable.startCountingTime = false;
                }
            }, 1000);
        }
        mapVariable.startCountingTime = true;
    }

    const _zoomToRaceLocation = (receivedMessage, mapVariable) => {
        if (!mapVariable.zoomedToRaceLocation) {
            map.setView({
                lat: receivedMessage.content.lat,
                lng: receivedMessage.content.lon
            }, 18)
            mapVariable.zoomedToRaceLocation = true;
        }
    }

    const _removeAllRaceObjectLayers = (mapVariable) => {
        Object.keys(mapVariable.deviceIdsToLayers).forEach(k => {
            try {
                map.removeLayer(mapVariable.deviceIdsToLayers[k])
            } catch (e) { }
        })
    }

    const initializeMapView = () => {
        new L.TileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`, {
            attribution: '<a href="https://www.github.com/sailing-yacht-research-foundation"><img src="https://syrf.io/wp-content/themes/syrf/assets/svg/icon-github.svg"></img></a>',
            maxZoom: 18,
            id: 'jweisbaum89/cki2dpc9a2s7919o8jqyh1gss',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'
        }).addTo(map);
    }

    return (
        <>
        </>
    )
}