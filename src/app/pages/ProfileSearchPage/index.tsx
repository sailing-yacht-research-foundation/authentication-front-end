import React from 'react';
import { Row } from 'antd';
// import { SearchResult } from './components/SearchResult';/
import styled from 'styled-components';

export const ProfileSearchPage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9', marginTop: '70px' }}>
            <ProfileWrapper>
                {/* <SearchResult /> */}
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