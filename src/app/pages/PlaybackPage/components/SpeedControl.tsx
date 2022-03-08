import { DownOutlined } from '@ant-design/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { usePlaybackSlice } from './slice';
import { selectPlaybackSpeed } from './slice/selectors';

const speeds = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

export const SpeedControl = React.memo(() => {

    const [showSpeedControl, setShowSpeedControl] = React.useState<boolean>(false);

    const playbackSpeed = useSelector(selectPlaybackSpeed);

    const dispatch = useDispatch();

    const { actions } = usePlaybackSlice();

    const changeSpeed = (speed) => {
        dispatch(actions.setPlaybackSpeed(speed));
        setShowSpeedControl(false);
    }

    React.useEffect(() => {
        dispatch(actions.setPlaybackSpeed(0));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <SpeedControlContainer>
            <a href="/" onClick={(event) => {
                event?.preventDefault();
                setShowSpeedControl(!showSpeedControl)
            }}>{playbackSpeed}x <DownOutlined /></a>
            {
                showSpeedControl && <SpeedContainerDropdown>
                    {speeds.map(value => {
                        return <a href="/" key={value} onClick={(e) => {
                            e.preventDefault();
                            changeSpeed(value);
                        }}>{value + 'x'}</a>;
                    })}
                </SpeedContainerDropdown>
            }
        </SpeedControlContainer>
    );
});


const SpeedControlContainer = styled.div`
`;

const SpeedContainerDropdown = styled.div`
    position: absolute;
    right: -5px;
    background: #fff;
    bottom: 100%;
    padding: 5px 5px;
    border: 1px solid #eee;
    width: 60px;
    border-radius: 10px;
    text-align: center;

    a {
        padding: 5px 2px;
        display: block;
        &:not(:last-child) {
            border-bottom: 1px solid #eee;
        }
    }
`;