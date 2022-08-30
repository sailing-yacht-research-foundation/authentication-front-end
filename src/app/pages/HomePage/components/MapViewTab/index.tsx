import 'leaflet/dist/leaflet.css';

import React, { useRef } from 'react';
import { Pagination } from 'antd';
import styled from 'styled-components';

import { media } from 'styles/media';
import { MapContainer, } from 'react-leaflet';
import { MapView } from './components/MapView';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectPage, selectPageSize, selectResults, selectTotal, selectUpcomingRaceDistanceCriteria, selectUpcomingRaceDurationCriteria, selectUpcomingRacePage, selectUpcomingRacePageSize, selectUpcomingRaces, selectUpcomingRaceTotal } from '../../slice/selectors';
import { BiTargetLock } from 'react-icons/bi';
import { StyleConstants } from 'styles/StyleConstants';
import { selectUserCoordinate } from 'app/pages/LoginPage/slice/selectors';
import { MAP_DEFAULT_VALUE } from "utils/constants";
import { LiveAndHappeningRaceFilter } from 'app/components/HomePage/LiveAndHappeningRaceFilter';
import { useHomeSlice } from '../../slice';
import { MapPaginationWrapper } from 'app/components/SyrfGeneral';

type MapViewProps = {
    zoomToCurrentUserLocationIfAllowed: () => void;
}

const ZOOM = 13;

export const MapViewTab = (props) => {

    const { onPaginationPageChanged } = props;

    const mapViewRef = useRef<MapViewProps>(null);

    const { t } = useTranslation();

    const total = useSelector(selectTotal);

    const page = useSelector(selectPage);

    const pageSize = useSelector(selectPageSize);

    const results = useSelector(selectResults);

    const upcomingRaceResults = useSelector(selectUpcomingRaces);

    const userCoordinate = useSelector(selectUserCoordinate);

    const [isFocusingOnSearchInput,] = React.useState<boolean>(false);

    const mapContainerRef = React.useRef<any>();

    const currentUpcomingRacePage = useSelector(selectUpcomingRacePage);

    const upcomingRacePageSize = useSelector(selectUpcomingRacePageSize);

    const upcomingRacesCount = useSelector(selectUpcomingRaceTotal);

    const duration = useSelector(selectUpcomingRaceDurationCriteria);

    const distance = useSelector(selectUpcomingRaceDistanceCriteria);

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const zoomToUserLocation = () => {
        if (null !== mapViewRef.current) {
            mapViewRef.current.zoomToCurrentUserLocationIfAllowed();
        }
    }

    const handleResize = () => {
        const navHeight = 73;
        const tabHeight = 76;
        mapContainerRef.current._container.style.height = (window.innerHeight - navHeight - tabHeight) + 'px';
    }

    React.useEffect(() => {
        window.scroll(0, 0);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const mapCenter = {
        lat: userCoordinate?.lat || MAP_DEFAULT_VALUE.CENTER.lat,
        lng: userCoordinate?.lon || MAP_DEFAULT_VALUE.CENTER.lng
    };

    const onUpcomingPageChanged = (page, size) => {
        dispatch(actions.getLiveAndUpcomingRaces({ duration, distance, page: page, size: size, coordinate: userCoordinate }));
    }

    const renderUpcomingRacePagination = () => {
        if (upcomingRaceResults.length > 0 && results.length === 0)
            return (
                <MapPaginationWrapper>
                    <Pagination defaultCurrent={1} current={currentUpcomingRacePage} onChange={onUpcomingPageChanged} total={upcomingRacesCount} pageSize={upcomingRacePageSize} />
                </MapPaginationWrapper>
            );

        return <></>;
    }

    return (
        <Wrapper>
            {results.length === 0 && <StyledLiveAndHappeningRaceFilter />}

            <MapContainer className="search-step-results" whenCreated={(mapInstance: any) => (mapContainerRef.current = mapInstance)} style={{ height: `calc(${window.innerHeight}px - ${StyleConstants.NAV_BAR_HEIGHT} - ${StyleConstants.TAB_BAR_HEIGHT})`, width: '100%', zIndex: 1 }} center={mapCenter} zoom={MAP_DEFAULT_VALUE.ZOOM}>
                <MapView isFocusingOnSearchInput={isFocusingOnSearchInput} ref={mapViewRef} zoom={ZOOM} />
            </MapContainer>

            {results.length > 0 && <MapPaginationWrapper>
                <Pagination defaultCurrent={1} current={page} onChange={onPaginationPageChanged} total={total} pageSize={pageSize} />
            </MapPaginationWrapper>}

            {renderUpcomingRacePagination()}

            {results.length === 0 && <MyLocationWrapper onClick={() => zoomToUserLocation()}>
                <StyledMyLocationIcon />
                <MyLocationText>{t(translations.home_page.my_location)}</MyLocationText>
            </MyLocationWrapper>}
        </Wrapper>
    )
}

const StyledLiveAndHappeningRaceFilter = styled(LiveAndHappeningRaceFilter)`
    z-index: 900;
    padding: 0 10px;
`;

const Wrapper = styled.div`
    position: relative;
`;

const MyLocationWrapper = styled.div`
    position: absolute;
    bottom: 50px;
    z-index: 10;
    cursor: pointer;
    left: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${media.large`
        bottom: 50px;
    `}
`;

const StyledMyLocationIcon = styled(BiTargetLock)`
    color: #fff;
    font-size: 30px;

    ${media.large`
        font-size: 40px;
    `}
`;

const MyLocationText = styled.span`
    color: #fff;
    font-size: 13px;
`;
