import React from 'react';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import { StyleConstants } from 'styles/StyleConstants';

export const ConnectButton = (props) => {
    return (
        <ConnectButtonContainer
            className={props.active ? 'active' : ''}
            onClick={props.onClick}
            title={props.title}>
            <ImageContainer  className={!props.connected ? 'not-connected' : ''}>
                {props.icon}
            </ImageContainer>
            <TextContainer className={!props.connected ? 'not-connected' : ''}>
                <ProviderTitle>{props.providerTitle}</ProviderTitle>
                {props.children}
            </TextContainer>
        </ConnectButtonContainer>
    )
}

const ConnectButtonContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items:center;
    flex-direction: row;
    width: 189px;
    padding: 15px 0;
    margin-right: 15px;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 15px;
    border-bottom: 4px solid rgba(79, 97, 165, .5);

    &.active {
        border-bottom: 4px solid ${StyleConstants.MAIN_TONE_COLOR};
    }
`;

const ConnectStatusText = styled.div`
    position: absolute;
    right: 10px;
    top: 10px;
    color: #00A8A8;
    font-family: ${StyleConstants.FONT_ROBOTO};
    font-weight: 500;
    font-size: 10px;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 15px;

    &.not-connected {
        opacity: .7;
    }
`

const ProviderTitle = styled.h4`
    font-family: ${StyleConstants.FONT_ROBOTO};
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.03em;
    color: #000000;
    margin-bottom: 5px;
`;

const ImageContainer = styled.div`
    &.not-connected {
        opacity: .7;
    }
`;

export const ConnectDisconnectButton = styled.div`
    font-family: ${StyleConstants.FONT_ROBOTO};
    font-style: normal;
    font-weight: bold;
    font-size: 8px;
    line-height: 9px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #000000;
`;
