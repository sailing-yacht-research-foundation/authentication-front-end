import React from 'react';
import { Row } from 'antd';
import { PublicProfile } from './components/PublicProfile';
import styled from 'styled-components';
import { media } from 'styles/media';

export const PublicProfilePage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: 'calc(100vh - 70px)', background: '#f7f7f9', marginTop: '70px' }}>
            <ProfileWrapper>
                <PublicProfile />
            </ProfileWrapper>
        </Row>
    )
}

const ProfileWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;

    ${media.medium`
        width: 75%;
        flex-direction: row;
    `}
`;