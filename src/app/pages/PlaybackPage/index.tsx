import 'leaflet/dist/leaflet.css';

import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import queryString from 'querystring';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MapContainer } from 'react-leaflet';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { Playback } from './components/Playback';
import {
    generateLastHeading
} from 'utils/race/race-helper';
import { useDispatch, useSelector } from 'react-redux';
import { EventEmitter } from 'events';
import { selectCompetitionUnitDetail, selectCompetitionUnitId, selectElapsedTime, selectIsPlaying, selectVesselParticipants } from './components/slice/selectors';
import { usePlaybackSlice } from './components/slice';
import { IoCaretBack } from 'react-icons/io5';
import { Wrapper } from 'app/components/SyrfGeneral';
import { MAP_DEFAULT_VALUE } from 'utils/constants';
import { StreamingRaceMap } from './components/StreamingRaceMap';
import { stringToColour } from 'utils/helpers';
import { useHistory, useLocation } from 'react-router';
import { selectSessionToken } from '../LoginPage/slice/selectors';

export const PlaybackPage = (props) => {
    const streamUrl = `${process.env.REACT_APP_SYRF_STREAMING_SERVER_SOCKETURL}`;
    const [socketUrl, setSocketUrl] = useState(streamUrl);
    const [eventEmitter, setEventEmitter] = useState(new EventEmitter());
    const location = useLocation();    
    const parsedQueryString: any = queryString.parse(location.search.includes('?') ? location.search.substring(1) : location.search);

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const dispatch = useDispatch();
        
    const messageHistory = useRef<any[]>([]);
    const competitionUnitId = useSelector(selectCompetitionUnitId);
    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);
    const vesselParticipants = useSelector(selectVesselParticipants);
    const isPlaying = useSelector(selectIsPlaying);
    const elapsedTime = useSelector(selectElapsedTime);
    const sessionToken = useSelector(selectSessionToken);
    
    const groupedPosition = useRef<any>({});
    const receivedPositionData = useRef<boolean>(false);
    const tracksData = useRef<any>([]);
    const normalizedPositions = useRef<any[]>([]);
    
    const currentTimeRef = useRef<number>(0);
    const currentElapsedTimeRef = useRef<number>(0);
    const isPlayingRef = useRef<any>(false);

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
        return () => {
            if (eventEmitter) {
                eventEmitter.removeAllListeners();
                eventEmitter.off('ping', () => { });
                eventEmitter.off('leg-update', () => { });    
            }
            dispatch(actions.setElapsedTime(0));
            dispatch(actions.setRaceLength(0));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Set socket url
    useEffect(() => {
        if (sessionToken) setSocketUrl(`${streamUrl}/authenticate?session_token=${sessionToken}`)
    }, [sessionToken])

    // Set competition unit id
    useEffect(() => {
        tracksData.current = {};
        if (parsedQueryString.competitionUnitId) dispatch(actions.setCompetitionUnitId(parsedQueryString.competitionUnitId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get competition unit detail
    useEffect(() => {
        if (competitionUnitId) dispatch(actions.getCompetitionUnitDetail({ id: competitionUnitId }));
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

    // Manage last message from websocket
    useEffect(() => {
        if (lastMessage) {
            const parsedData = JSON.parse(lastMessage.data);
            const { type, dataType, data } = parsedData;
            if (type === 'data' && dataType === 'position') handleAddPosition(data);
        }
    }, [lastMessage])

    // Manage subscription of websocket
    useEffect(() => {
        if (connectionStatus === 'open') {
            message.success('Connected!')
            dispatch(actions.setIsPlaying(true));
            sendJsonMessage({
                action: 'subscribe',
                data: {
                    competitionUnitId: competitionUnitId
                }
            })
        }

        if (connectionStatus === 'connecting') {
            dispatch(actions.setIsPlaying(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectionStatus, competitionUnitId])

    // Manage message of websocket status
    useEffect(() => {
        if (connectionStatus === 'open') message.success('Connected!');
        if (connectionStatus === 'connecting') message.info('Connecting...');
    }, [connectionStatus])

    // Normalize data every 1 second
    useEffect(() => {
        const interval = setInterval(() => {
            handleNormalizeTracksData();
        }, 1000)

        return () => {
            clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Send last positions every 1 second
    useEffect(() => {
        const interval = setInterval(() => {
            const currentNormalizedPositions = normalizedPositions.current;
            const currentIsPlaying = isPlayingRef.current;
            handleEmitRaceEvent(currentNormalizedPositions, currentIsPlaying, eventEmitter);
        }, 1000)

        return () => {
            clearInterval(interval);
        }
    }, [])

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying])

    useEffect(() => {
        currentElapsedTimeRef.current = elapsedTime;
    }, [elapsedTime])

    const handleSetRaceLengthStreaming = (currentLength) => {
        dispatch(actions.setRaceLength(currentLength));
    }

    const handleSetElapsedTime = (elapsedTime) => {
        dispatch(actions.setElapsedTime(elapsedTime));
    }

    // Noramalize data
    const handleNormalizeTracksData = () => {
        const grouped = groupedPosition.current;
        const currentIsPlaying = isPlayingRef.current;
        const groupedVesselCount = Object.keys(grouped)?.length > 0 ;

        if (!groupedVesselCount) return;
        if (!receivedPositionData.current) return;

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

        // Add the current time ref
        currentTimeRef.current += 1000;

        // Stop when receieve no more data
        if (receivedPositionData.current) {
            receivedPositionData.current = false;
            handleSetRaceLengthStreaming(currentTimeRef.current);
        }
    }

    // Emit race event
    const handleEmitRaceEvent = (normalizedPositions, currentIsPlaying, eventEmitter) => {
        // Reject incomplete data
        if(!normalizedPositions || !normalizedPositions?.length || !eventEmitter || !currentIsPlaying) return;
        
        const currentTime = currentTimeRef.current;
        const currentElapsedTime = currentElapsedTimeRef.current;
        const currentPositions = normalizedPositions.map((boat) => {
            const positions = boat.positions.filter((pos) => pos.time <= currentElapsedTime);
            const lastPosition = positions[positions.length - 1];
            return {...boat, positions, lastPosition};
        });

        // Emit latest event
        eventEmitter.emit('ping', currentPositions);
        eventEmitter.emit('leg-update', currentPositions);

        if (currentElapsedTime < currentTime) {
            let nextElapsedTime = currentElapsedTimeRef.current + 1000;
            if (nextElapsedTime > currentTime) nextElapsedTime = currentTime;

            currentElapsedTimeRef.current = nextElapsedTime;
            handleSetElapsedTime(nextElapsedTime);
        };



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
            <MapContainer style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT})`, width: '100%' }} center={MAP_DEFAULT_VALUE.CENTER} zoom={MAP_DEFAULT_VALUE.ZOOM}>
                <Playback />
                <StreamingRaceMap emitter={eventEmitter} />
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