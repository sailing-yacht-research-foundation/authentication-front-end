import React from 'react';
import styled from 'styled-components/macro';

export const ConnectButton = (props) => {
    return (
        <ConnectButtonContainer
            className={props.connected ? 'connected' : ''}
            onClick={props.connected ? () => { } : props.onClick}
            style={{ background: props.bgColor ? props.bgColor : '#fff' }}
            title={props.title}>
            {props.children}
        </ConnectButtonContainer>
    )
}

const ConnectButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items:center;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    margin: 0 15px;
    cursor: pointer;

    &.connected {
       opacity: 0.7;
       cursor: default;
    }
`;
