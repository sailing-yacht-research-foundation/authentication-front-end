import 'leaflet/dist/leaflet.css';

import React, { useRef } from 'react';
import { Pagination } from 'antd';
import styled from 'styled-components';

import { media } from 'styles/media';
import { MapContainer, } from 'react-leaflet';
import { MapView } from './components/MapView';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectPage, selectPageSize, selectResults, selectTotal } from '../../slice/selectors';
import { BiTargetLock } from 'react-icons/bi';
import { StyleConstants } from 'styles/StyleConstants';
import { FilterSearchBar } from './components/FilterSearchBar';

type MapViewProps = {
    zoomToCurrentUserLocationIfAllowed: () => void;
}

const center = {
    lng: -122.4,
    lat: 37.8
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

    const [isFocusingOnSearchInput, setIsFocusingOnSearchInput] = React.useState<boolean>(false);

    const mapContainerRef = React.useRef<any>();

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

    return (
        <Wrapper>
            <MapContainer className="search-step-results" whenCreated={(mapInstance: any) => (mapContainerRef.current = mapInstance)} style={{ height: `calc(${window.innerHeight}px - ${StyleConstants.NAV_BAR_HEIGHT} - ${StyleConstants.TAB_BAR_HEIGHT})`, width: '100%', zIndex: 1 }} center={center} zoom={ZOOM}>
                <MapView isFocusingOnSearchInput={isFocusingOnSearchInput} ref={mapViewRef} zoom={ZOOM} />
            </MapContainer>
            {
                results.length > 0 && <PaginationWrapper>
                    <Pagination defaultCurrent={1} current={page} onChange={onPaginationPageChanged} total={total} pageSize={pageSize} />
                </PaginationWrapper>
            }
            <FilterSearchBar setIsFocusingOnSearchInput={setIsFocusingOnSearchInput} />
            {
                results.length === 0 && <MyLocationWrapper onClick={() => zoomToUserLocation()}>
                    <StyledMyLocationIcon />
                    <MyLocationText>{t(translations.home_page.map_view_tab.my_location)}</MyLocationText>
                </MyLocationWrapper>
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
`;

const MyLocationWrapper = styled.div`
    position: absolute;
    bottom: 20px;
    z-index: 10;
    cursor: pointer;
    left: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${media.medium`
        bottom: 20px;
    `}
`;

const StyledMyLocationIcon = styled(BiTargetLock)`
    color: #fff;
    font-size: 30px;

    ${media.medium`
        font-size: 40px;
    `}
`;

const MyLocationText = styled.span`
    color: #fff;
    font-size: 13px;
`;

const PaginationWrapper = styled.div`
    position: absolute;
    bottom: 140px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 570px;
    max-width: 98%;
    z-index: 11;
    text-align: center;
`;