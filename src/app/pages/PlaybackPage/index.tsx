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
import { IoIosArrowBack } from 'react-icons/io';

const center = {
    lng: -125.688816,
    lat: 47.822007
}

const ZOOM = 13;

const HEADER_HEIGHT = '97px';

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
            <PageHeadContainer>
                {history.action !== 'POP' && <GobackButton onClick={() => history.goBack()}>
                    <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                </GobackButton>}
                <PageInfoContainer>
                    <PageHeading>{'Race name'}</PageHeading> {/** Adding race here, will replace when we have the live data */}
                    <PageDescription>{'Race description'}</PageDescription>
                </PageInfoContainer>
            </PageHeadContainer>
            <MapContainer style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT} - ${HEADER_HEIGHT})`, width: '100%' }} center={center} zoom={ZOOM}>
                <RaceMap race={race} eventEmitter={ee} zoom={ZOOM} />
                <Playback race={race} />
            </MapContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;

const PageHeading = styled.h2`
    padding: 20px 15px;
    padding-bottom: 0px;
`;

const PageHeadContainer = styled.div`
    display: flex;
    align-items: center;
`;

const PageInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const PageDescription = styled.p`
    padding: 0 15px;
`;

const GobackButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;