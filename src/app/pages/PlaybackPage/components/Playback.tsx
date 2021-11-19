import React from 'react';
import { milisecondsToMinutes, renderNumberWithCommas } from 'utils/helpers';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { MdReplay5, MdForward5, MdForward10, MdReplay10 } from 'react-icons/md';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { selectCompetitionUnitDetail, selectElapsedTime, selectIsPlaying, selectPlaybackType, selectRaceLength, selectViewCounts } from './slice/selectors';
import { usePlaybackSlice } from './slice';
import { PlaybackTypes } from 'types/Playback';
import { media } from 'styles/media';
import moment from 'moment';
import { SpeedControl } from './SpeedControl';
import { BiTargetLock } from 'react-icons/bi';
import { TIME_FORMAT } from 'utils/constants';

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
    const { onPlaybackTimeManualUpdate, emitter } = props;
    const elapsedTime = useSelector(selectElapsedTime);
    const raceLength = useSelector(selectRaceLength);
    const isPlaying = useSelector(selectIsPlaying);
    const playbackType = useSelector(selectPlaybackType);
    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);
    const viewCounts = useSelector(selectViewCounts);

    const dispatch = useDispatch();

    const { actions } = usePlaybackSlice();

    const progressBarContainerRef = React.createRef<HTMLDivElement>();

    const calculateRaceProgressBarWidth = (elapsedTime, raceLength) => {
        let percentage = 0;

        if (elapsedTime > 0)
            percentage = (elapsedTime / raceLength) * 100;

        if (percentage > 100) percentage = 100;

        return percentage;
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

    const renderViewsCount = () => {
        return playbackType && [PlaybackTypes.OLDRACE, PlaybackTypes.STREAMINGRACE].includes(playbackType) && <RightItemContainer>{renderNumberWithCommas(viewCounts)} views</RightItemContainer>;
    }

    const renderSpeedControl = () => {
        return playbackType && [PlaybackTypes.OLDRACE].includes(playbackType) && <RightItemContainer>
            <SpeedControl />
        </RightItemContainer>
    }

    const backToRaceArea = () => {
        emitter.emit('zoom-to-location');
    }

    return (
        <PlaybackWrapper>
            <PlaybackTopRightItemsContainer>
                {renderViewsCount()}
                <RightItemContainer>{moment(competitionUnitDetail?.approximateStart).format(TIME_FORMAT.date_text)}</RightItemContainer>
                {renderSpeedControl()}
                <RightItemContainer>
                    <BackToRaceAreaButton onClick={backToRaceArea}/>
                </RightItemContainer>
            </PlaybackTopRightItemsContainer>
            <PlaybackLengthOutterContainer>
                <PlaybackLengthContainer>
                    <TimeText>{milisecondsToMinutes(elapsedTime)}</TimeText>
                    <ProgressBarWrapper>
                        <ProgressBar ref={progressBarContainerRef} onClick={playAtClickedPosition}>
                            <ProgressedBar style={{ width: `${calculateRaceProgressBarWidth(elapsedTime, raceLength)}%` }} />
                        </ProgressBar>
                    </ProgressBarWrapper>
                    <TimeText>{milisecondsToMinutes(raceLength)}</TimeText>
                </PlaybackLengthContainer>
            </PlaybackLengthOutterContainer>
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

const PlaybackTopRightItemsContainer = styled.div`
    text-align: right;
    display: flex;
    justify-content: flex-end;
    padding: 5px;
`;

const RightItemContainer = styled.div`
    margin: 0 7px;
    position: relative;
    color: #606060;

    &:not(:last-child):after {
        display: block;
        content: ' ';
        width: 3px;
        height: 3px;
        background: rgb(160, 160, 160);
        border-radius: 50%;
        position: absolute;
        right: -10px;
        top: 50%;
    }
`;

const PlaybackWrapper = styled.div`
    z-index: 999;
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

const ProgressBarWrapper = styled.div`
    width: 100%;
    position: absolute;
    top: 30px;
    padding: 0 15px;

    ${media.medium`
        padding: 0;
        margin-top: 0;
        position: relative;
        width: 87%;
        top: 0;
    `}

`;

const ProgressBar = styled.div`
    height: 7px;
    background: #ddd;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
`;

const ProgressedBar = styled.div`
    width: 25%;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    height: 100%;
    transition: width 0.2s;
    z-index: 11000;
    border-radius: 5px;
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
    cursor: pointer;
`;

const PlaybackLengthOutterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top: 15x;
    margin-bottom: 5px;

    ${media.medium`
        margin-top: 10px;
    `}
`;

const PlaybackLengthContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 5px 0px;
    padding: 0 5px;

    ${media.medium`
        width: 90%;
    `}
`;

const TimeText = styled.span`
    color: ${StyleConstants.MAIN_TONE_COLOR};
    font-size: 14px;
    margin: 0 5px;
`;

const BackToRaceAreaButton = styled(BiTargetLock)`
    font-size: 20px;
    cursor: pointer;
`