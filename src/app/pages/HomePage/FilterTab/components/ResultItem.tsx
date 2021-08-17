import React from 'react';
import styled from 'styled-components';
import { GiPositionMarker } from 'react-icons/gi';
import { Space } from 'antd';
import { Link } from 'react-router-dom';

export const ResultItem = (props) => {
    const race = props.item;

    return (
        <Wrapper key={props.index}>
            <HeadDescriptionWrapper>
                <Space size={5}>
                    <GiPositionMarker />
                    {race.location}
                </Space>
            </HeadDescriptionWrapper>
            <Name><Link to="/playback?raceid=xxx_xxx_xxx">{race.name}</Link></Name>
            <DescriptionWrapper>
                <DescriptionItem>
                    Team: 6
                </DescriptionItem>
                •
                <DescriptionItem>
                    Length: 1:00:21
                </DescriptionItem>
                •
                <DescriptionItem>
                    Winner: Lübecker Yacht-Club
                </DescriptionItem>
                •
                <DescriptionItem>
                    07-01-2021
                </DescriptionItem>
            </DescriptionWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    border: 1px solid #DADCE0;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    width: 100%;
`;

const Name = styled.h3`
    color: #40a9ff;
    margin: 10px 0;
    padding: 0;
`;

const HeadDescriptionWrapper = styled.div`
    color: #70757a;
`;

const DescriptionWrapper = styled.div``;

const DescriptionItem = styled.span`
    :first-child {
        margin-right: 10px;
    }

    :not(:first-child) {
        margin: 0 5px;
    }
`;