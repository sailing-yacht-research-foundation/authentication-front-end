import React from 'react';
import { Row } from 'antd';
import { PublicProfile } from './components/PublicProfile';
import styled from 'styled-components';
import { PeopleYouMayKnow } from './components/PeopleYouMayKnow';

export const PublicProfilePage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: 'calc(100vh - 70px)', background: '#f7f7f9', marginTop: '70px' }}>
            <ProfileWrapper>
                <PublicProfile />
                <PeopleYouMayKnow/>
            </ProfileWrapper>
        </Row>
    )
}

const ProfileWrapper = styled.div`
    width: 75%;
    display: flex;
    justify-content: center;
    flex-direction: row;
`;