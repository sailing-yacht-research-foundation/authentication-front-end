import React from 'react';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import { StyleConstants } from 'styles/StyleConstants';

export const ConnectButton = (props) => {
    return (
        <ConnectButtonContainer
            className={props.connected ? 'connected' : ''}
            onClick={props.connected ? () => { } : props.onClick}
            title={props.title}>
            {props.connected && <ConnectStatusText>Connected</ConnectStatusText>}
            {props.icon}
            <ProviderTitle>{ props.providerTitle }</ProviderTitle>
            {props.children}
        </ConnectButtonContainer>
    )
}

const ConnectButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items:center;
    flex-direction: column;
    width: 189px;;
    height: 116px;
    border-radius: 50%;
    margin: 0 15px;
    cursor: pointer;
    border: 1px solid #4F61A6;
    box-sizing: border-box;
    border-radius: 10px;
    position: relative;
    margin-bottom: 15px;

    ${media.medium`
        margin-bottom: 0;
    `}
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

const ProviderTitle = styled.h4`
    font-family: ${StyleConstants.FONT_ROBOTO};
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 0.03em;
    text-align: left;
    margin-top: 10px;
`;

export const ConnectDisconnectButton = styled.div`
    font-family: ${StyleConstants.FONT_ROBOTO};
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 0.03em;
    text-align: left;
    color: #4F61A5;
`;
