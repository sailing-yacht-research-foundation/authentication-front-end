import 'leaflet/dist/leaflet.css';

import React, { useEffect } from 'react';
import { MapContainer } from 'react-leaflet';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { Playback } from './components/Playback';
import { RaceMap } from './components/RaceMap';
import * as CourseData from 'utils/race/data/0a0b3868-f8c6-403f-923d-0ad515e0236a_course_definition.json';
import * as MarkData from 'utils/race/data/0a0b3868-f8c6-403f-923d-0ad515e0236a_mark_positions.json';
import * as TrackData from 'utils/race/data/0a0b3868-f8c6-403f-923d-0ad515e0236a_tracks.json';
import RaceDirector from 'utils/race/RaceDirector';
import OuroborosRace from 'utils/race/OuroborosRace';
import {
    collectTrackDataFromGeoJson,
    getLastTrackPingTime,
    calculateTrackPingTime,
    sortTrackFirstPingTime
} from 'utils/race/race-helper';
import { useDispatch, useSelector } from 'react-redux';
import { EventEmitter } from 'events';
import { selectRaceLength } from './components/slice/selectors';
import { usePlaybackSlice } from './components/slice';
import { useState } from 'react';

const center = {
    lng: -125.688816,
    lat: 47.822007
}

const ZOOM = 13;

const ee = new EventEmitter();

let race: OuroborosRace;

export const PlaybackPage = (props) => {

    const dispatch = useDispatch();

    const raceLength = useSelector(selectRaceLength);

    const { actions } = usePlaybackSlice();

    useEffect(() => {
        const tracks = collectTrackDataFromGeoJson(TrackData, MarkData);
        sortTrackFirstPingTime(tracks);
        calculateTrackPingTime(tracks);
        setRaceLength(tracks);
        initRace(tracks);       
    }, []);

    const setRaceLength = (tracks) => {
        if (raceLength === 0)
            dispatch(actions.setRaceLength(getLastTrackPingTime(tracks)));
    }

    const initRace = (tracks) => {
        const raceInformation = {
            tracks: tracks,
            course: JSON.parse(JSON.stringify(CourseData)).default,
            id: '0a0b3868-f8c6-403f-923d-0ad515e0236a'
        };
        race = new OuroborosRace(raceInformation, new RaceDirector(ee), ee);
    }

    return (
        <Wrapper>
            <MapContainer style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT})`, width: '100%' }} center={center} zoom={ZOOM}>
                <RaceMap ee={ee} zoom={ZOOM} />
                <Playback race={race} />
            </MapContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;