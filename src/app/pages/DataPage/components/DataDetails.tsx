import React from 'react';
import styled from 'styled-components';
import Iframe from 'react-iframe'
import { StyleConstants } from 'styles/StyleConstants';
import { IoIosArrowBack } from 'react-icons/io';
import { GobackButton, PageDescription, PageHeading } from 'app/components/SyrfGeneral';

export const DataDetails = (props) => {
    const { data, goBack } = props;

    React.useEffect(() => {
        window.scroll(0, 0);
    }, []);

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
                <Iframe width={'100%'} height={`100%`} url={data.htmlUrl}></Iframe>
            </IframeContainer>
        </Wrapper>
    )
}


const PageHeadContainer = styled.div`
    display: flex;
    align-items: center;
`;

const PageInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Wrapper = styled.div`
 margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;

const IframeContainer = styled.div`
    height: calc(${window.innerHeight}px - 17vh);
`;