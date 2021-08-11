import React, { useEffect } from 'react';
import * as L from 'leaflet';
import { useMap } from 'react-leaflet';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import { BsFillSkipBackwardFill, BsFillSkipForwardFill, BsPlayFill } from 'react-icons/bs';
import { media } from 'styles/media';
import * as CourseData from 'utils/race/data/0a0b3868-f8c6-403f-923d-0ad515e0236a_course_definition.json';
import * as MarkData from 'utils/race/data/0a0b3868-f8c6-403f-923d-0ad515e0236a_mark_positions.json';
import * as TrackData from 'utils/race/data/0a0b3868-f8c6-403f-923d-0ad515e0236a_tracks.json';
import RaceDirector from 'utils/race/RaceDirector';
import OuroborosRace from 'utils/race/OuroborosRace';
import { CgFlag } from 'react-icons/cg';
import ReactDOMServer from 'react-dom/server';
import { PlayerInfo } from './PlayerInfo';

require("leaflet.boatmarker");
require('leaflet-hotline');
const turf = require('@turf/turf');

const buttonStyle = {
    fontSize: '25px',
    color: '#fff'
}

export const Playback = (props) => {

    const map = useMap();

    useEffect(() => {


        initializeMapView();

        const tracks: any[] = [];

        TrackData.features.forEach(boatFeature => {
            if (boatFeature.geometry.coordinates.length > 0) {
                tracks.push({
                    type: 'boat',
                    id: boatFeature.properties.competitor_id,
                    first_ping_time: boatFeature.geometry.coordinates[0][3],
                    track: boatFeature.geometry.coordinates,
                    competitor_name: boatFeature.properties.competitor_name,
                    competitor_sail_number: boatFeature.properties.competitor_sail_number
                })
            }
        })

        MarkData.features.forEach(markFeature => {
            if (markFeature.geometry.coordinates.length > 0) {
                tracks.push({ type: 'mark', id: markFeature.properties.mark_id, first_ping_time: markFeature.geometry.coordinates[0][3], track: markFeature.geometry.coordinates })
            }
        })

        const timeOffset = tracks[0].first_ping_time
        let pingIndex = 0
        for (let trackIndex in tracks) {
            const track = tracks[trackIndex]
            track.first_ping_time = track.first_ping_time - timeOffset
            for (let positionIndex in track.track) {
                track.track[positionIndex][3] = track.track[positionIndex][3] - timeOffset
                track.track[positionIndex][2] = pingIndex
                pingIndex++
            }
        }

        const raceInformation = {
            tracks: tracks,
            course: JSON.parse(JSON.stringify(CourseData)).default,
            id: '0a0b3868-f8c6-403f-923d-0ad515e0236a'
        };

        var EventEmitter = require('events');
        var ee = new EventEmitter();

        const raceDirector = new RaceDirector(ee);
        const ouroborsosRace = new OuroborosRace(raceInformation, raceDirector, ee);

        const deviceIdsToLayers = {};
        const deviceIdsToBoatMarkers = {};
        var zoomToRaceLocation = false;

        ee.on('ping', function (data) {
            let received_msg = JSON.parse(data);

            let deviceId = received_msg.deviceId

            let json = toSimplifiedGeoJson(received_msg)
            let heading = simplifiedGeoJsonTrackToLastHeading(json)

            if (!zoomToRaceLocation) {
                map.setView({
                    lat: received_msg.content.lat,
                    lng: received_msg.content.lon
                }, 18)
                zoomToRaceLocation = true;
            }

            //console.log(received_msg)
            Object.keys(deviceIdsToLayers).forEach(k => {
                try {
                    map.removeLayer(deviceIdsToLayers[k])
                    map.removeLayer(deviceIdsToBoatMarkers[k])
                } catch (e) {

                }
            })

            var boatMarker;

            console.log(received_msg.color);

            if (received_msg.deviceType == 'boat') {
                boatMarker = L.boatMarker([received_msg.content.lat, received_msg.content.lon], {
                    color: received_msg.color, 	// color of the boat
                    idleCircle: false	// if set to true, the icon will draw a circle if
                    // boatspeed == 0 and the ship-shape if speed > 0
                }).on('click', function () {
                    var markerLayer = L.marker([received_msg.content.lat, received_msg.content.lon], { clickable: false })
                        .bindPopup(ReactDOMServer.renderToString(<PlayerInfo playerLocation={{
                            lat: received_msg.content.lat, long: received_msg.content.lon
                        }} playerData={received_msg.playerData} />)).openPopup().setOpacity(0).addTo(map);
                    markerLayer.openPopup();
                });

                boatMarker.setHeading(heading);
            } else {
                boatMarker = L.marker([received_msg.content.lat, received_msg.content.lon], {

                    icon: L.divIcon({
                        html: ReactDOMServer.renderToString(<CgFlag style={{ color: '#fff', fontSize: '35px' }} />),
                        iconSize: [20, 20],
                        className: 'myDivIcon'
                    })
                });
            }

            let coords = simulateThirdParameter(json);

            var hotlineLayer = L.polyline(coords).setStyle({
                color: received_msg.color,
                weight: 1
            })

            deviceIdsToLayers[deviceId] = hotlineLayer
            deviceIdsToBoatMarkers[deviceId] = boatMarker

            Object.keys(deviceIdsToLayers).forEach(k => {
                deviceIdsToLayers[k].addTo(map);
                deviceIdsToBoatMarkers[k].addTo(map)
            })
        });
    }, []);

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

    const simplifiedGeoJsonTrackToLastHeading = (geojson) => {
        if (!geojson.features[0].geometry.coordinates) return;

        var lastIndex = geojson.features[0].geometry.coordinates.length - 1
        var lastPoint = geojson.features[0].geometry.coordinates[lastIndex]
        var secondLastPoint = geojson.features[0].geometry.coordinates[lastIndex - 1]

        var point1 = turf.point(lastPoint);
        var point2 = turf.point(secondLastPoint);

        var bearing = turf.bearing(point2, point1);
        return bearing
    }

    const toSimplifiedGeoJson = (message) => {
        var obj = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:3857',
                },
            },
            'features': [
                {
                    'type': 'Feature',
                    'geometry': message.simplified?.geometry ? message.simplified?.geometry : {}
                }]
        }
        return obj
    }

    const simulateThirdParameter = (geojson) => {

        let coords: any[] = []
        let index = 0;

        if (geojson.features[0].geometry.coordinates)
            geojson.features[0].geometry.coordinates.forEach(point => {
                let p = [point[1], point[0], index % 360]
                index += 10
                coords.push(p)
            });

        return coords
    }

    return (
        <>
            <PlaybackWrapper>
                <ProgressBar>
                    <ProgressedBar />
                </ProgressBar>
                <PlaybackLengthContainer>
                    <TimeText>12:57</TimeText>
                    <TimeText>2:12:57</TimeText>
                </PlaybackLengthContainer>
                <PlayBackControlContainer>
                    <ButtonContainer>
                        <BsFillSkipBackwardFill style={buttonStyle} />
                    </ButtonContainer>
                    <ButtonContainer >
                        <BiSkipPrevious style={buttonStyle} />
                    </ButtonContainer>
                    <ButtonContainer>
                        <BsPlayFill style={buttonStyle} />
                    </ButtonContainer>
                    <ButtonContainer>
                        <BiSkipNext style={buttonStyle} />
                    </ButtonContainer>
                    <ButtonContainer>
                        <BsFillSkipForwardFill style={buttonStyle} />
                    </ButtonContainer>
                </PlayBackControlContainer>
            </PlaybackWrapper>
        </>
    )
}

const PlaybackWrapper = styled.div`
    z-index: 99999;
    width: 100%;
    height: 150px;
    background: #fff;
    position: fixed;
    border-top: 1px solid #eee;
    bottom: 0;
    display: flex;
    flex-direction: column;
    bottom: 0;
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 7px;
    background: #ddd;
`;

const ProgressedBar = styled.div`
    width: 25%;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    height: 100%;
`;

const PlayBackControlContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`;

const ButtonContainer = styled.div`
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    margin: 0 10px;
`;

const PlaybackLengthContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 5px 0px;
    padding: 0 5px;
`;

const TimeText = styled.span`
    color: ${StyleConstants.MAIN_TONE_COLOR};
    font-size: 14px;
`;

const Leaderboard = styled.div`
    position: fixed;
    z-index: 9999;
    width: 100%;
    bottom: 150px;

    ${media.medium`
        width: auto;
    `}
`;

const LeaderboardToggleButton = styled.div`
    position: absolute;
    right: -10px;
`;