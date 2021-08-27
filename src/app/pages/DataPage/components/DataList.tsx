import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { DataDetails } from './DataDetails';

const dataArray = [
    {
        title: 'Race Starts as Points',
        description: 'An animated view of individual races over the last few decades. Each dot is a unique race.',
        screenshotUrl: '/static-htmls/A_race_starts/screenshot.png',
        htmlUrl: '/static-htmls/A_race_starts/race_start_locations.html',
    },
    {
        title: 'Race Clusters',
        description: 'Race starts grouped into clusters based on the scale of the map view.',
        screenshotUrl: '/static-htmls/B_race_clusters/screenshot.png',
        htmlUrl: '/static-htmls/B_race_clusters/race_clusters.html',
    },
    {
        title: 'Race Regions',
        description: 'Polygons containing races for the last 20 years with a count of how many races occured in that region.',
        screenshotUrl: '/static-htmls/C_regions/screenshot.png',
        htmlUrl: '/static-htmls/C_regions/sailing_regions.html',
    },
    {
        title: 'Race Region Boxes',
        description: 'Similar to race regions, except this is a view of nice rectangular boxes that contain each region. Overlapping boxes have been combined.',
        screenshotUrl: '/static-htmls/D_region_boxes/screenshot.png',
        htmlUrl: '/static-htmls/D_region_boxes/boxes_around_regions.html',
    },
    {
        title: 'Yacht Club Density',
        description: '3D Hexbin map to visualize the density of yacht clubs.',
        screenshotUrl: '/static-htmls/E_yacht_clubs/screenshot.png',
        htmlUrl: '/static-htmls/E_yacht_clubs/yacht_clubs.html',
    }
];

export const DataList = () => {

    const [showDetail, setShowDetail] = React.useState<boolean>(false);

    const [selectedDataItem, setSelectedDataItem] = React.useState<any>({});

    const { t } = useTranslation();

    const renderDataItem = () => {
        return dataArray.map(data => {
            return <ItemContainer onClick={e => renderDataDetail(data)}>
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

    :not(:first-child) {
        border-top: 1px solid #eee;
    }

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
`;

const ItemTitle = styled.h4`
    color: #1890ff;
    cursor: pointer;
`;

const ItemDescription = styled.p`
    margin-top: 5px;
`;