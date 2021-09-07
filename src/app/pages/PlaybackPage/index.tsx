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
import { IoCaretBack } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import { Wrapper } from 'app/components/SyrfGeneral';
import { MAP_DEFAULT_VALUE } from 'utils/helpers';

let ee;

let race: OuroborosRace;

export const PlaybackPage = (props) => {

    const dispatch = useDispatch();

    const raceLength = useSelector(selectRaceLength);

    const { actions } = usePlaybackSlice();

    const history = useHistory();

    useEffect(() => {
        const tracks = collectTrackDataFromGeoJson(TrackData, MarkData);
        sortTrackFirstPingTime(tracks);
        calculateTrackPingTime(tracks);
        setRaceLength(tracks);
        initRace(tracks);

        return () => {
            ee.removeAllListeners();
            ee.off('ping', () => { });
            ee.off('leg-update', () => { });
            ee.off('geometry', () => { });
            ee = null;
            dispatch(actions.setElapsedTime(0));
            dispatch(actions.setRaceLength(0));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setRaceLength = (tracks) => {
        if (raceLength === 0)
            dispatch(actions.setRaceLength(getLastTrackPingTime(tracks)));
    }

    const initRace = (tracks) => {
        ee = new EventEmitter();
        const raceInformation = {
            tracks: tracks,
            course: JSON.parse(JSON.stringify(CourseData)).default,
            id: '0a0b3868-f8c6-403f-923d-0ad515e0236a'
        };
        race = new OuroborosRace(raceInformation, new RaceDirector(ee), ee);
    }

    return (
        <Wrapper>
            <MapContainer style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT})`, width: '100%' }} center={MAP_DEFAULT_VALUE.CENTER} zoom={MAP_DEFAULT_VALUE.ZOOM}>
                <RaceMap race={race} eventEmitter={ee} zoom={MAP_DEFAULT_VALUE.ZOOM} />
                <Playback race={race} />
                {history.action !== 'POP' && <GoBackButton onClick={() => history.goBack()}>
                    <IoCaretBack />
                </GoBackButton>}
            </MapContainer>
        </Wrapper>
    );
}

const GoBackButton = styled.div`
    position: absolute;
    top: 90px;
    left: 12px;
    width: 30px;
    height: 30px;
    z-index: 9998;
    background: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items:center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.65);
    border-radius: 2px;
`;