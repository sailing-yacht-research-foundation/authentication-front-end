import React from 'react';
import styled from 'styled-components';
import { GiPositionMarker } from 'react-icons/gi';
import { Space } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

export const ResultItem = (props) => {
    const race = props.item;

    return (
        <Wrapper key={props.index}>
            <HeadDescriptionWrapper>
                <Space size={5}>
                    <GiPositionMarker />
                    {race.locationName}
                </Space>
            </HeadDescriptionWrapper>
            <Name><Link to={`/playback?raceid=${race.id}`}>{race.name}</Link></Name>
            <DescriptionWrapper>
                <DescriptionItem>
                    {moment(race.approximateStartTime).format('MMM. D, YYYY')}
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