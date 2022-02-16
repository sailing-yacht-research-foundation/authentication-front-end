import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { media } from 'styles/media';

export const FullScreen = (props) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const { container } = props;

    const handleOpenFullScreen = () => {
        if (document?.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        } else {
            const fullScreenDiv = container?.current;
            if (fullScreenDiv?.requestFullscreen) {
                fullScreenDiv.requestFullscreen();
            } else if (fullScreenDiv?.webkitRequestFullscreen) {
                fullScreenDiv.webkitRequestFullscreen();
            }
        }
    }

    React.useEffect(() => {
        window.addEventListener('fullscreenchange', function (e) {
            if (document?.fullscreenElement) {
                setIsFullScreen(true);
            } else {
                setIsFullScreen(false);
            }
        });
    }, []);

    const handleCloseFullScreen = () => {
        if (document?.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    return (
        <div style={{ marginLeft: "8px" }}>
            {isFullScreen ?
                <ExitFullScreenButton onClick={handleCloseFullScreen} />
                :
                <FullScreenButton onClick={handleOpenFullScreen} />
            }
        </div>
    )
}

const FullScreenButton = styled(AiOutlineFullscreen)`
    font-size: 24px;
    cursor: pointer;
    display: none;

    ${media.medium`
        display: block;
    `};
`;

const ExitFullScreenButton = styled(AiOutlineFullscreenExit)`
    font-size: 24px;
    cursor: pointer;
`;