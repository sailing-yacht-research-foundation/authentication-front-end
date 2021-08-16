import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import { useMap } from 'react-leaflet';
import { CgFlag } from 'react-icons/cg';
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
import { selectElapsedTime } from './slice/selectors';
import MarkIcon from '../assets/mark.svg';

require("leaflet.boatmarker");
require('leaflet-hotline');

const objectType = {
    boat: 'boat',
    mark: 'mark',
    course: 'course',
    leg: 'leg'
}

export const RaceMap = (props) => {

    const { ee } = props;

    const map = useMap();

    const dispatch = useDispatch();

    const { actions } = usePlaybackSlice();

    const elapsedTime = useRef(0);

    const playbackElapsedTime = useSelector(selectElapsedTime);

    useEffect(() => {
        initializeMapView();

        const mapVariable: any = {
            deviceIdsToLayers: {},
            deviceIdsToBoatMarkers: {},
            gemetryLayers: [],
            legLayer: [],
            zoomedToRaceLocation: false,
            deviceMarker: null,
            markerAttachedToMap: false,
            deviceIdToElapsedTime: ''
        }

        ee.on('geometry', function (data) {

            mapVariable.gemetryLayers.forEach(layer => {

                map.removeLayer(layer);
            })

            let geometryData = JSON.parse(data);

            geometryData.geometry.forEach(geometry => {
                let coords = simulateThirdParameterForCourse(geometry.geometry.coordinates);
                if (geometry.geometry.type === 'LineString') {
                    let hotlineLayer = L.polyline(coords).setStyle({
                        weight: 1,
                        color: 'black'
                    }).addTo(map);

                    mapVariable.gemetryLayers.push(hotlineLayer);
                } else if (geometry.geometry.type === 'Point') {
                    // let hotlineLayer = L.marker([geometry.geometry.coordinates[1], geometry.geometry.coordinates[0]]).addTo(map);

                    // mapVariable.gemetryLayers.push(hotlineLayer);
                }
            });
        });

        ee.on('leg-update', function (data) {
            mapVariable.legLayer.forEach(layer => {

                map.removeLayer(layer);
            })

            let geometryData = JSON.parse(data);

            geometryData.leg.forEach(leg => {

                if (leg.geometry.type == "LineString") {
                    let coords = simulateThirdParameterForCourse(leg.geometry.coordinates);
                    let hotlineLayer = L.polyline(coords).setStyle({
                        weight: 1,
                        color: 'black'
                    }).addTo(map);

                    mapVariable.legLayer.push(hotlineLayer);
                }
            });
                // geometryData.leg..forEach(geometry => {
                //     let coords = simulateThirdParameterForCourse(geometry.geometry.coordinates);
                //     if (geometry.geometry.type ==='LineString') {
                //         let hotlineLayer = L.polyline(coords).setStyle({
                //             weight: 1,
                //             color: 'black'
                //         }).addTo(map);

                //         mapVariable.gemetryLayers.push(hotlineLayer);
                //     } else if (geometry.geometry.type ==='Point') {
                //         // let hotlineLayer = L.marker([geometry.geometry.coordinates[1], geometry.geometry.coordinates[0]]).addTo(map);

                //         // mapVariable.gemetryLayers.push(hotlineLayer);
                //     }
                // });
            });

            ee.on('ping', function (data) {
                let receivedMessage = JSON.parse(data);
                let deviceId = receivedMessage.deviceId;
                let json = toSimplifiedGeoJson(receivedMessage);
                let heading = simplifiedGeoJsonTrackToLastHeading(json);
                let deviceMarker;
                let coords = simulateThirdParameter(json);

                let hotlineLayer = L.polyline(coords).setStyle({
                    color: receivedMessage.color,
                    weight: 1
                });

                setRaceElapsedTime(receivedMessage, mapVariable);
                zoomToRaceLocation(receivedMessage, mapVariable);
                removeAllRaceObjectLayers(mapVariable);

                if (receivedMessage.deviceType == objectType.boat) {
                    deviceMarker = L.boatMarker([receivedMessage.content.lat, receivedMessage.content.lon], {
                        color: receivedMessage.color, 	// color of the boat
                        idleCircle: false	// if set to true, the icon will draw a circle if
                    }).bindPopup(ReactDOMServer.renderToString(<PlayerInfo playerLocation={{
                        lat: receivedMessage.content.lat, long: receivedMessage.content.lon
                    }} playerData={receivedMessage.playerData} />)).openPopup();
                } else if (receivedMessage.deviceType === objectType.mark) {
                    deviceMarker = L.marker([receivedMessage.content.lat, receivedMessage.content.lon], {
                        icon: new L.icon({
                            iconUrl: MarkIcon,
                            iconSize: [40, 40]
                        })
                    });
                }

                mapVariable.deviceIdsToLayers[deviceId] = hotlineLayer;
                if (mapVariable.deviceIdsToBoatMarkers[deviceId] == null) {
                    mapVariable.deviceIdsToBoatMarkers[deviceId] = {
                        layer: deviceMarker
                    }
                } else {
                    mapVariable.deviceIdsToBoatMarkers[deviceId].layer.setLatLng(new L.LatLng(receivedMessage.content.lat, receivedMessage.content.lon));
                    if (receivedMessage.deviceType == objectType.boat) {
                        mapVariable.deviceIdsToBoatMarkers[deviceId].layer.setHeading(heading);
                    }
                }

                Object.keys(mapVariable.deviceIdsToLayers).forEach(k => {
                    mapVariable.deviceIdsToLayers[k].addTo(map);
                    if (mapVariable.deviceIdsToBoatMarkers[k].attached == undefined) {
                        mapVariable.deviceIdsToBoatMarkers[k].layer.addTo(map);
                        mapVariable.deviceIdsToBoatMarkers[k].attached = true;
                    }
                });
            });
        }, []);

        useEffect(() => {
            elapsedTime.current = playbackElapsedTime;
        }, [playbackElapsedTime]);

        const setRaceElapsedTime = (receivedMessage, mapVariables) => {
            if (elapsedTime.current > 0 && mapVariables.deviceIdToElapsedTime === receivedMessage.deviceId) {
                elapsedTime.current += 1000;
                dispatch(actions.setElapsedTime(elapsedTime.current));
                return;
            }

            if (receivedMessage.content.time > elapsedTime.current) {
                elapsedTime.current = receivedMessage.content.time;
                dispatch(actions.setElapsedTime(receivedMessage.content.time));
                mapVariables.deviceIdToElapsedTime = receivedMessage.deviceId;
            }
        }

        const zoomToRaceLocation = (receivedMessage, mapVariables) => {
            if (!mapVariables.zoomedToRaceLocation) {
                map.setView({
                    lat: receivedMessage.content.lat,
                    lng: receivedMessage.content.lon
                }, 18)
                mapVariables.zoomedToRaceLocation = true;
            }
        }

        const removeAllRaceObjectLayers = (mapVariable) => {
            Object.keys(mapVariable.deviceIdsToLayers).forEach(k => {
                try {
                    map.removeLayer(mapVariable.deviceIdsToLayers[k])
                    // map.removeLayer(mapVariable.deviceIdsToBoatMarkers[k])
                } catch (e) {
                }
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