import React, { useState } from 'react';
import { milisecondsToMinutes } from 'utils/helpers';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import { BsFillSkipBackwardFill, BsFillSkipForwardFill, BsPlayFill, BsPauseFill } from 'react-icons/bs';
import { media } from 'styles/media';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectElapsedTime, selectRaceLength } from './slice/selectors';
import { usePlaybackSlice } from './slice';

const buttonStyle = {
    fontSize: '25px',
    color: '#fff'
}

export const Playback = (props) => {

    const { race } = props;

    const elapsedTime = useSelector(selectElapsedTime);

    const raceLength = useSelector(selectRaceLength);

    const dispatch = useDispatch();

    const { actions } = usePlaybackSlice();

    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    const calculateRaceProgressBarWidth = (elapsedTime, raceLength) => {
        if (elapsedTime > 0)
            return (elapsedTime / raceLength) * 100;

        return 0;
    }

    const pauseUnPauseRace = () => {
        setIsPlaying(!isPlaying);
        race.pauseUnpauseAllPing()
    }

    const backward = (miliseconds) => {
        let backwardTime = elapsedTime - miliseconds;
        dispatch(actions.setElapsedTime(backwardTime > 0 ? backwardTime : 0));
        race.backward(miliseconds);
    }

    const forward = (miliseconds) => {
        let forwardTime = elapsedTime + miliseconds;
        dispatch(actions.setElapsedTime(forwardTime > raceLength ? raceLength : forwardTime));
        race.forward(miliseconds);
    }

    const playAtClickedPosition = (e) => {
        let rect = e.target.getBoundingClientRect();
        let progressWidth = e.target.offsetWidth;
        let x = e.clientX - rect.left; //x position within the element.
        let percentage = (x / progressWidth) * 100;
        let miliseconds = ((raceLength * percentage) / 100);

        miliseconds = (Math.floor(miliseconds));

        let stringMiliseconds = String(miliseconds).split('');

        stringMiliseconds.forEach((num, index)=> {
            if (String(miliseconds).length - (index + 1) <= 2) {
                stringMiliseconds[index] = '0';
            }
        });

        let convertedMiliseconds = Number(stringMiliseconds.join(''));
        dispatch(actions.setElapsedTime(convertedMiliseconds));
        race.playAt(convertedMiliseconds);
    }

    return (
        <PlaybackWrapper>
            <ProgressBar onClick={playAtClickedPosition}>
                <ProgressedBar style={{ width: `${calculateRaceProgressBarWidth(elapsedTime, raceLength)}%` }} />
            </ProgressBar>
            <PlaybackLengthContainer>
                <TimeText>{milisecondsToMinutes(elapsedTime)}</TimeText>
                <TimeText>{milisecondsToMinutes(raceLength)}</TimeText>
            </PlaybackLengthContainer>
            <PlayBackControlContainer>
                <ButtonContainer>
                    <BsFillSkipBackwardFill style={buttonStyle} />
                </ButtonContainer>
                <ButtonContainer onClick={() => backward(5000)}>
                    <BiSkipPrevious style={buttonStyle} />
                </ButtonContainer>
                <ButtonContainer onClick={pauseUnPauseRace}>
                    {isPlaying ? <BsPauseFill style={buttonStyle} /> : <BsPlayFill style={buttonStyle} />}
                </ButtonContainer>
                <ButtonContainer onClick={() => forward(5000)}>
                    <BiSkipNext style={buttonStyle} />
                </ButtonContainer>
                <ButtonContainer>
                    <BsFillSkipForwardFill style={buttonStyle} />
                </ButtonContainer>
            </PlayBackControlContainer>
        </PlaybackWrapper>
    )
}

const PlaybackWrapper = styled.div`
    z-index: 999999999;
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