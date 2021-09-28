import React from 'react';
import styled from 'styled-components';
import { GiPositionMarker } from 'react-icons/gi';
import { Space } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { renderEmptyValue } from 'utils/helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';

export const ResultItem = (props) => {
    const race = props.item;

    const { t } = useTranslation();

    return (
        <Wrapper key={props.index}>
            <HeadDescriptionWrapper>
                <Space size={5}>
                    <GiPositionMarker />
                    {race._source.start_country}
                </Space>
            </HeadDescriptionWrapper>
            <Name><Link to={`/playback?raceid=${race._id}`}>{race._source.name}</Link></Name>
            {race._source?.event_description && <Description>{race._source?.event_description}</Description>}
            <DescriptionWrapper>
                <DescriptionItem>
                    {t(translations.home_page.filter_tab.filter_result.date)} {moment(race._source.approx_start_time_ms).format(TIME_FORMAT.date_text)}
                </DescriptionItem>
                <DescriptionItem>
                    {t(translations.home_page.filter_tab.filter_result.event_name)} {renderEmptyValue(race._source.event_name)}
                </DescriptionItem>
                <DescriptionItem>
                    {t(translations.home_page.filter_tab.filter_result.city)} {renderEmptyValue(race._source.city)}
                </DescriptionItem>
                <DescriptionItem>
                    {t(translations.home_page.filter_tab.filter_result.country)} {renderEmptyValue(race._source.start_country)}
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
    color: #70757a;
    :first-child {
        margin-right: 10px;
    }

    :not(:first-child) {
        margin: 0 5px;
    }
`;

const Description = styled.p`
    font-size: 13px;
`;