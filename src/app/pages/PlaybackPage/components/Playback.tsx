import React from 'react';
import { milisecondsToMinutes } from 'utils/helpers';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { MdReplay5, MdForward5, MdForward10, MdReplay10 } from 'react-icons/md';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { selectElapsedTime, selectIsPlaying, selectRaceLength } from './slice/selectors';
import { usePlaybackSlice } from './slice';

const buttonStyle = {
    fontSize: '25px',
    color: '#fff'
}

const playbackTime = {
    forward: 5000,
    backward: 5000,
    fastForward: 15000,
    fastBackward: 15000,
}

export const Playback = (props) => {
    const { onPlaybackTimeManualUpdate } = props;
    const elapsedTime = useSelector(selectElapsedTime);
    const raceLength = useSelector(selectRaceLength);
    const isPlaying = useSelector(selectIsPlaying);    

    const dispatch = useDispatch();

    const { actions } = usePlaybackSlice();

    const progressBarContainerRef = React.createRef<HTMLDivElement>();

    const calculateRaceProgressBarWidth = (elapsedTime, raceLength) => {
        if (elapsedTime > 0)
            return (elapsedTime / raceLength) * 100;

        return 0;
    }

    const pauseUnPauseRace = () => {
        dispatch(actions.setIsPlaying(!isPlaying));
    }

    const backward = (miliseconds) => {
        let backwardTime = elapsedTime - miliseconds;
        const selectedMillis = backwardTime > 0 ? backwardTime : 0;
        dispatch(actions.setElapsedTime(selectedMillis));
        if (onPlaybackTimeManualUpdate) onPlaybackTimeManualUpdate(selectedMillis);
    }

    const forward = (miliseconds) => {
        let forwardTime = elapsedTime + miliseconds;
        const selectedMillis = forwardTime > raceLength ? raceLength : forwardTime
        dispatch(actions.setElapsedTime(selectedMillis));
        if (onPlaybackTimeManualUpdate) onPlaybackTimeManualUpdate(selectedMillis);
    }

    const playAtClickedPosition = (e) => {
        let rect = e.target.getBoundingClientRect();
        let progressWidth = 0;

        if (progressBarContainerRef.current) {
            progressWidth = progressBarContainerRef.current.offsetWidth;
        }

        let clickedWidth = e.clientX - rect.left;
        let clickedWidthInPercentage = (clickedWidth / progressWidth) * 100;
        let newPlayTimeInMiliseconds = ((raceLength * clickedWidthInPercentage) / 100);

        newPlayTimeInMiliseconds = (Math.floor(newPlayTimeInMiliseconds));

        let newPlayTimeInMilisecondsInString = String(newPlayTimeInMiliseconds).split('');

        newPlayTimeInMilisecondsInString.forEach((num, index) => {
            if (String(newPlayTimeInMiliseconds).length - (index + 1) <= 2) {
                newPlayTimeInMilisecondsInString[index] = '0';
            }
        });

        let convertedPlayTimeInMiliseconds = Number(newPlayTimeInMilisecondsInString.join(''));
        dispatch(actions.setElapsedTime(convertedPlayTimeInMiliseconds));
        if (onPlaybackTimeManualUpdate) onPlaybackTimeManualUpdate(convertedPlayTimeInMiliseconds);
    }

    return (
        <PlaybackWrapper>
            <ProgressBar ref={progressBarContainerRef} onClick={playAtClickedPosition}>
                <ProgressedBar style={{ width: `${calculateRaceProgressBarWidth(elapsedTime, raceLength)}%` }} />
            </ProgressBar>
            <PlaybackLengthContainer>
                <TimeText>{milisecondsToMinutes(elapsedTime)}</TimeText>
                <TimeText>{milisecondsToMinutes(raceLength)}</TimeText>
            </PlaybackLengthContainer>
            <PlayBackControlContainer>
                <ButtonContainer onClick={() => backward(playbackTime.fastBackward)}>
                    <MdReplay10 style={buttonStyle} />
                </ButtonContainer>
                <ButtonContainer onClick={() => backward(playbackTime.backward)}>
                    <MdReplay5 style={buttonStyle} />
                </ButtonContainer>
                <ButtonContainer onClick={pauseUnPauseRace}>
                    {isPlaying ? <BsPauseFill style={buttonStyle} /> : <BsPlayFill style={buttonStyle} />}
                </ButtonContainer>
                <ButtonContainer onClick={() => forward(playbackTime.forward)}>
                    <MdForward5 style={buttonStyle} />
                </ButtonContainer>
                <ButtonContainer onClick={() => forward(playbackTime.fastForward)}>
                    <MdForward10 style={buttonStyle} />
                </ButtonContainer>
            </PlayBackControlContainer>
        </PlaybackWrapper>
    )
}

const PlaybackWrapper = styled.div`
    z-index: 9998;
    width: 100%;
    height: 150px;
    background: #fff;
    position: absolute;
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
    position: relative;
`;

const ProgressedBar = styled.div`
    width: 25%;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    height: 100%;
    transition: width 0.2s;
    z-index: 11000;
`;

const PlayBackControlContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
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