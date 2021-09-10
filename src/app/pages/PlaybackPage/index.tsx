import 'leaflet/dist/leaflet.css';

import React, { useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MapContainer, useMap } from 'react-leaflet';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { Playback } from './components/Playback';
import OuroborosRace from 'utils/race/OuroborosRace';
import {
    collectTrackDataFromGeoJson,
    getLastTrackPingTime,
    calculateTrackPingTime,
    sortTrackFirstPingTime,
    generateLastHeading
} from 'utils/race/race-helper';
import { useDispatch, useSelector } from 'react-redux';
import { EventEmitter } from 'events';
import { selectCompetitionUnitDetail, selectCompetitionUnitId, selectRaceLength, selectVesselParticipants } from './components/slice/selectors';
import { usePlaybackSlice } from './components/slice';
import { IoCaretBack } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import { StreamingRaceMap } from './components/StreamingRaceMap';
import { stringToColour } from 'utils/helpers';

const center = {
    lng: -125.688816,
    lat: 47.822007
}

const ZOOM = 13;

let ee;

let race: OuroborosRace;

const streamUrl = 'wss://streaming-server-dev.syrf.io/authenticate?session_token=';
const defaultSessionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhODI0OTYzLTlkYmUtNDExYy05MmQyLTUxZjVkNTFjOWZiOSIsInJvbGUiOiJhbm9ueW1vdXMiLCJpc3N1ZWRBdCI6MTYzMDU3NTk3NzM1NCwiZGV2VG9rZW5JZCI6IjQ0YjA2YTY4LTJiNDMtNGRiYS1iNmYxLTgyNmJjMWNiYjJmNCIsImlhdCI6MTYzMDU3NTk3N30.-KiOjyRe-9VOFFdboWw4aM79Z08Glx-9wWPDJEGjf8E';
const defaultCompetitionUnitId = "bd80854f-802b-4bbe-a9cf-fba6d6f13ba6";

export const PlaybackPage = (props) => {
    const [socketUrl, setSocketUrl] = useState(`${streamUrl}${defaultSessionToken}`);
    const [eventEmitter, setEventEmitter] = useState(new EventEmitter())

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const dispatch = useDispatch();

    
    const raceLength = useSelector(selectRaceLength);
    
    const messageHistory = useRef<any[]>([]);
    const competitionUnitId = useSelector(selectCompetitionUnitId);
    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);
    const vesselParticipants = useSelector(selectVesselParticipants);
    
    const groupedPosition = useRef<any>({});
    const receivedPositionData = useRef<boolean>(false);
    const tracksData = useRef<any>([]);
    const normalizedPositions = useRef<any[]>([]);
    
    const currentTimeRef = useRef<number>(0);
    const currentElapsedTimeRef = useRef<number>(0);

    const { actions } = usePlaybackSlice();

    const history = useHistory();

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'connecting',
        [ReadyState.OPEN]: 'open',
        [ReadyState.CLOSING]: 'closing',
        [ReadyState.CLOSED]: 'closed',
        [ReadyState.UNINSTANTIATED]: 'uninstantiated',
      }[readyState];

    useEffect(() => {
        // const tracks = collectTrackDataFromGeoJson(TrackData, MarkData);
        // sortTrackFirstPingTime(tracks);
        // calculateTrackPingTime(tracks);
        // setRaceLength(tracks);
        // initRace(tracks);

        return () => {
            if (ee) {
                ee.removeAllListeners();
                ee.off('ping', () => { });
                ee.off('leg-update', () => { });
                ee.off('geometry', () => { });
                ee = null;
    
            }
            dispatch(actions.setElapsedTime(0));
            dispatch(actions.setRaceLength(0));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Set competition unit id
    useEffect(() => {
        tracksData.current = {};
        dispatch(actions.setCompetitionUnitId(defaultCompetitionUnitId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get competition unit detail
    useEffect(() => {
        if (competitionUnitId) dispatch(actions.getCompetitionUnitDetail({ id: defaultCompetitionUnitId}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [competitionUnitId]);

    // Get vessel participants
    useEffect(() => {
        if (competitionUnitDetail?.vesselParticipantGroupId) dispatch(actions.getVesselParticipants({}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [competitionUnitDetail]);

    // Update local grouped result
    useEffect(() => {
        if (!!vesselParticipants?.length) {
            const currentValue = groupedPosition.current;

            const groupedResult = {};
            const participantTracks: any[] = [];
            vesselParticipants.forEach((vessParticipant) => {
                const { id } = vessParticipant;
                groupedResult[id] = {...vessParticipant, positions: currentValue?.[id]?.positions || []};
            
                const data = {
                    type: 'boat',
                    track: [],
                    competitor_name: vessParticipant?.vessel?.publicName,
                    competitor_sail_number: vessParticipant?.vesselParticipantId,
                    first_ping_time: 0,
                    id: vessParticipant.id,
                }

                participantTracks.push(data);
            });
            groupedPosition.current = groupedResult;
        }
    }, [vesselParticipants]);

    useEffect(() => {
        if (lastMessage) {
            const parsedData = JSON.parse(lastMessage.data);
            const { type, dataType, data } = parsedData;
            if (type === 'data' && dataType === 'position') handleAddPosition(data);
        }
    }, [lastMessage])

    useEffect(() => {
        if (connectionStatus === 'open') {
            sendJsonMessage({
                action: 'subscribe',
                data: {
                    competitionUnitId: defaultCompetitionUnitId
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectionStatus])

    useEffect(() => {
        const interval = setInterval(() => {
            handleNormalizeTracksData();
        }, 1000)

        return () => {
            clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSetRaceLengthStreaming = (currentLength) => {
        dispatch(actions.setRaceLength(currentLength));
    }

    const handleNormalizeTracksData = () => {
        const grouped = groupedPosition.current;
        const groupedVesselCount = Object.keys(grouped)?.length > 0 ;

        if (!groupedVesselCount) return;
        if (!receivedPositionData.current) return;

        if (!ee) ee = new EventEmitter();

        // Let's normalize the participant data!
        // The reason would be, we couldn't control the interval of the receieved data for each boat
        // from the websocket stream (boat A could have 40 position but boat B could have 30 position).
        
        // This normalization purpose is to make sure that every boat have same amount of position in certain time.
        // By doing this, we could receieve a state where all of the boat have same amount of data.

        // I personaly think this will reduce the complexity of managing the position.

        // DATA FORMAT
        // [..., BOAT: { id, identity, color, positions (normalized positions), lastPosition (default last positions) }, ...]
        // Please bear in mind, this normalization only for the boat (participant), we will make a different setup
        // for the tracks soon.

        // Positions purpose is to draw historical related rendering (probably such as leg or playback)
        // lastPosition is the most updated position. Just make it so we could easily manage the code.


        const currentNormalizedPositions = normalizedPositions.current;
        const currentTime = currentTimeRef.current;

        Object.keys(grouped).forEach((key) => {
            const {id, lastPosition, vessel, vesselParticipantId} = grouped[key];
            const isExist = currentNormalizedPositions.filter((nP) => nP.id === id);
            if (!isExist.length) {
                currentNormalizedPositions.push({ id, deviceType: 'boat', positions: [ {...lastPosition, time: currentTime} ], lastPosition, vesselParticipantId, participant: { competitor_name: vessel.publicName, competitor_sail_number: vessel.id }, color: stringToColour(vesselParticipantId) });
            } else {
                isExist[0].positions.push({...lastPosition, time: currentTime});
                isExist[0].lastPosition = {...lastPosition, time: currentTime};
            };
        });

        if (currentNormalizedPositions && !!currentNormalizedPositions?.length && ee) {
            eventEmitter.emit('ping', currentNormalizedPositions)
        }

        // Add the current time ref
        currentTimeRef.current += 1000;

        // Stop when receieve no more data
        receivedPositionData.current = false;

        // Set the race length
        handleSetRaceLengthStreaming(currentTimeRef.current);
    }

    const handleAddPosition = (data) => {
        messageHistory.current.push(data);

        const { raceData, lat,lon, elapsedTime  } = data;
        const { vesselParticipantId } = raceData;

        // Reject vessel participant id
        if (!vesselParticipantId) return;

        // Add position to groupedPosition
        const currentGroupedPosition = groupedPosition.current?.[vesselParticipantId];
        if (!currentGroupedPosition || !currentGroupedPosition?.id) return;

        // Get current available positions of each grouped positions
        const currentPositions = [ ...(currentGroupedPosition?.positions || [])];
        
        // Generate heading
        const positionLength = currentPositions.length;
        const previousCoordinate = positionLength >= 2 ? [currentPositions[positionLength-2].lon, currentPositions[positionLength-2].lat] : [lon, lat];
        const heading = generateLastHeading(previousCoordinate, [lon, lat]);

        // Save data
        currentPositions.push({lat, lon, heading});
        currentGroupedPosition.positions = currentPositions;
        currentGroupedPosition.lastPosition = { lat, lon, heading };

        groupedPosition.current[vesselParticipantId] = currentGroupedPosition;
        
        if (!receivedPositionData.current) receivedPositionData.current = true;
    };

    return (
        <Wrapper>
            <MapContainer style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT})`, width: '100%' }} center={center} zoom={ZOOM}>
                {/* <RaceMap race={race} eventEmitter={ee} zoom={ZOOM} /> */}
                <Playback race={race} />
                {/* {history.action !== 'POP' && <GoBackButton onClick={() => history.goBack()}> */}
                {/* <IoCaretBack /> */}
                {/* </GoBackButton>} */}
                <StreamingRaceMap emitter={eventEmitter} />
            </MapContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;

const GoBackButton = styled.div`
    position: absolute;
    top: 90px;
    left: 12px;
    width: 30px;
    height: 30px;
    z-index: 9999;
    background: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items:center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.65);
    border-radius: 2px;
`;