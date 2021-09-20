import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { DataDetails } from './DataDetails';
import i18next from 'i18next';
import { media } from 'styles/media';

const dataArray = [
    {
        title: i18next.t(translations.data_page.races_start_as_points),
        description: i18next.t(translations.data_page.an_animated_view_of_individual),
        screenshotUrl: '/static-htmls/A_race_starts/screenshot.png',
        htmlUrl: '/static-htmls/A_race_starts/race_start_locations.html',
    },
    {
        title: i18next.t(translations.data_page.race_clusters),
        description: i18next.t(translations.data_page.race_starts_grouped),
        screenshotUrl: '/static-htmls/B_race_clusters/screenshot.png',
        htmlUrl: '/static-htmls/B_race_clusters/race_clusters.html',
    },
    {
        title: i18next.t(translations.data_page.race_regions),
        description: i18next.t(translations.data_page.polygons_containing_races),
        screenshotUrl: '/static-htmls/C_regions/screenshot.png',
        htmlUrl: '/static-htmls/C_regions/sailing_regions.html',
    },
    {
        title: i18next.t(translations.data_page.race_region_boxes),
        description: i18next.t(translations.data_page.similar_to_racec_regions),
        screenshotUrl: '/static-htmls/D_region_boxes/screenshot.png',
        htmlUrl: '/static-htmls/D_region_boxes/boxes_around_regions.html',
    },
    {
        title: i18next.t(translations.data_page.yatch_club_density),
        description: i18next.t(translations.data_page.hexbin_map_to_visualize),
        screenshotUrl: '/static-htmls/E_yacht_clubs/screenshot.png',
        htmlUrl: '/static-htmls/E_yacht_clubs/yacht_clubs.html',
    }
];

export const DataList = () => {

    const [showDetail, setShowDetail] = React.useState<boolean>(false);

    const [selectedDataItem, setSelectedDataItem] = React.useState<any>({});

    const { t } = useTranslation();

    const renderDataItem = () => {
        return dataArray.map((data, index) => {
            return <ItemContainer key={index} onClick={e => renderDataDetail(data)}>
                <ItemScreenshot style={{ background: `url(${data.screenshotUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
                <ItemInfoContainer>
                    <ItemTitle>{data.title}</ItemTitle>
                    <ItemDescription>
                        {data.description}
                    </ItemDescription>
                </ItemInfoContainer>
            </ItemContainer>;
        });
    }

    const renderDataDetail = (data) => {
        setSelectedDataItem(data);
        setShowDetail(true);
    }

    const goBack = () => {
        setShowDetail(false);
    }

    return (
        <>
            {
                !showDetail ? (
                    < Wrapper >
                        <PageHeading>{t(translations.data_page.syrf_race_data)}</PageHeading>
                        {renderDataItem()}
                    </Wrapper >
                )
                    : (<DataDetails goBack={goBack} data={selectedDataItem} />)
            }
        </>
    )
}

const Wrapper = styled.div`
    padding: 10px 15px;
    margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;

export const PageHeading = styled.h2`
    margin-top: 30px;
    margin-bottom: 30px;
`;

const ItemContainer = styled.div`
    width: 100%;
    display: flex;
    margin-bottom: 15px;
    align-items: center;

    :not(:last-child) {
        border-bottom: 1px solid #eee;
    }
`;

const ItemScreenshot = styled.div`
    width: 100px;
    height: 100px;
    margin-right: 30px;
    flex-shrink: 0;
`;

const ItemInfoContainer = styled.div`
    display:flex;
    flex-direction: column;
    padding-top: 15px;

    ${media.medium`
        padding-top: 0;
    `}
`;

const ItemTitle = styled.h4`
    color: #1890ff;
    cursor: pointer;
`;

const ItemDescription = styled.p`
    margin-top: 5px;
`;