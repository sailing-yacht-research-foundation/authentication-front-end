import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import { useMap } from 'react-leaflet';
import { CgFlag } from 'react-icons/cg';
import ReactDOMServer from 'react-dom/server';
import { PlayerInfo } from './PlayerInfo';
import {
    simplifiedGeoJsonTrackToLastHeading,
    simulateThirdParameter,
    toSimplifiedGeoJson
} from 'utils/race/race-helper';
import { useDispatch, useSelector } from 'react-redux';
import { usePlaybackSlice } from './slice';
import { selectElapsedTime } from './slice/selectors';

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

        const mapVariable = {
            deviceIdsToLayers: {},
            deviceIdsToBoatMarkers: {},
            zoomedToRaceLocation: false,
            deviceMarker: null
        }

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

            setRaceElapsedTime(receivedMessage);
            zoomToRaceLocation(receivedMessage, mapVariable);
            removeAllRaceObjectLayers(mapVariable);
            
            if (receivedMessage.deviceType == objectType.boat) {
                deviceMarker = L.boatMarker([receivedMessage.content.lat, receivedMessage.content.lon], {
                    color: receivedMessage.color, 	// color of the boat
                    idleCircle: false	// if set to true, the icon will draw a circle if
                }).on('click', function () {
                    var markerLayer = L.marker([receivedMessage.content.lat, receivedMessage.content.lon], { clickable: false })
                        .bindPopup(ReactDOMServer.renderToString(<PlayerInfo playerLocation={{
                            lat: receivedMessage.content.lat, long: receivedMessage.content.lon
                        }} playerData={receivedMessage.playerData} />)).openPopup().setOpacity(0).addTo(map);
                    markerLayer.openPopup();
                });
                deviceMarker.setHeading(heading);
            } else if (receivedMessage.deviceType === objectType.mark) {
                deviceMarker = L.marker([receivedMessage.content.lat, receivedMessage.content.lon], {
                    icon: L.divIcon({
                        html: ReactDOMServer.renderToString(<CgFlag style={{ color: '#fff', fontSize: '35px' }} />),
                        iconSize: [20, 20],
                        className: 'myDivIcon'
                    })
                });
            }

            mapVariable.deviceIdsToLayers[deviceId] = hotlineLayer;
            mapVariable.deviceIdsToBoatMarkers[deviceId] = deviceMarker;

            Object.keys(mapVariable.deviceIdsToLayers).forEach(k => {
                mapVariable.deviceIdsToLayers[k].addTo(map);
                mapVariable.deviceIdsToBoatMarkers[k].addTo(map)
            });

        });
    }, []);

    useEffect(() => {
        elapsedTime.current = playbackElapsedTime;
    }, [playbackElapsedTime]);

    const setRaceElapsedTime = (receivedMessage) => {
        if (receivedMessage.content.time > elapsedTime.current) {
            elapsedTime.current = receivedMessage.content.time;
            dispatch(actions.setElapsedTime(receivedMessage.content.time));
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
                map.removeLayer(mapVariable.deviceIdsToBoatMarkers[k])
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