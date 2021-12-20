import React from 'react';
import { Row } from 'antd';
import { Main } from './components/Main';
import styled from 'styled-components';
import { media } from 'styles/media';

export const ProfileSearchPage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9', marginTop: '70px' }}>
            <Wrapper>
                <Main />
            </Wrapper>
        </Row>
    )
}

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: row;

    ${media.medium`
        width: 75%;
    `};
`;