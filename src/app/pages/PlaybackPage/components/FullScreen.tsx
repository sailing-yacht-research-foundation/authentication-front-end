import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';

export const FullScreen = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleOpenFullScreen = () => {
        if (document?.body?.requestFullscreen) {
            document.body.requestFullscreen(); 
            setIsFullScreen(true);
            return;
        };

        setIsFullScreen(false);
    }

    const handleCloseFullScreen = () => {
        if (document?.exitFullscreen) {
            document.exitFullscreen();
            setIsFullScreen(false);
            return;
        };
    }

    return (
        <div style={{ marginLeft: "8px" }}>
            { isFullScreen ? 
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
`;

const ExitFullScreenButton = styled(AiOutlineFullscreenExit)`
    font-size: 24px;
    cursor: pointer;
`;