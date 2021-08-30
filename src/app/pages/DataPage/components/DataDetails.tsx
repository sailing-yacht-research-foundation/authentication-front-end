import React from 'react';
import styled from 'styled-components';
import Iframe from 'react-iframe'
import { StyleConstants } from 'styles/StyleConstants';
import { IoIosArrowBack } from 'react-icons/io';

export const DataDetails = (props) => {
    const { data, goBack } = props;

    return (
        <Wrapper>
            <PageHeadContainer>
                <GobackButton onClick={() => goBack()}>
                    <IoIosArrowBack style={{fontSize:'40px', color: '#1890ff'}}/>
                </GobackButton>
                <PageInfoContainer>
                    <PageHeading>{data.title}</PageHeading>
                    <PageDescription>{data.description}</PageDescription>
                </PageInfoContainer>
            </PageHeadContainer>
            <IframeContainer>
                <Iframe width={'100%'} height={'100%'} url={data.htmlUrl}></Iframe>
            </IframeContainer>
        </Wrapper>
    )
}

const PageHeading = styled.h2`
    padding: 20px 15px;
    padding-bottom: 0px;
`;

const PageHeadContainer = styled.div`
    display: flex;
    align-items: center;
`;

const PageInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const PageDescription = styled.p`
    padding: 0 15px;
`;

const Wrapper = styled.div`
 margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;

const IframeContainer = styled.div`
    height: 83vh;
`;

const GobackButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;