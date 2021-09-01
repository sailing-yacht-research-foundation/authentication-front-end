import 'leaflet/dist/leaflet.css';

import React, { useRef } from 'react';
import { Input, Spin } from 'antd';
import styled from 'styled-components';
import { ReactComponent as SYRFLogo } from '../assets/logo-dark.svg';
import { FilterPane } from '../../FilterTab/components/FilterPane';
import { media } from 'styles/media';
import { MapContainer, } from 'react-leaflet';
import { MapView } from './MapView';
import { StyleConstants } from 'styles/StyleConstants';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsSearching, selectSearchKeyword } from '../../slice/selectors';
import { useHomeSlice } from '../../slice';
import { BiTargetLock } from 'react-icons/bi';

type MapViewProps = {
    zoomToCurrentUserLocationIfAllowed: () => void;
}

const TAB_BAR_HEIGHT = '76px';

const center = {
    lng: -122.4,
    lat: 37.8
}

const ZOOM = 13;

export const MapViewTab = () => {

    const [showSearchPanel, setShowSearchPanel] = React.useState<boolean>(false);

    const searchKeyword = useSelector(selectSearchKeyword);

    const mapViewRef = useRef<MapViewProps>(null);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const isSearching = useSelector(selectIsSearching);

    const searchForRaces = (e) => {
        if (e.keyCode === 13 || e.which === 13)
            dispatch(actions.searchRaces({ keyword: searchKeyword }));
    }

    const zoomToUserLocation = () => {
        if (null !== mapViewRef.current) {
            mapViewRef.current.zoomToCurrentUserLocationIfAllowed();
        }
    }

    return (
        <Wrapper>
            <MapContainer style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT} - ${TAB_BAR_HEIGHT})`, width: '100%' }} center={center} zoom={ZOOM}>
                <MapView ref={mapViewRef} zoom={ZOOM} />
            </MapContainer>
            <SearchBarWrapper>
                <SearchBarInnerWrapper>
                    <StyledSearchBar
                        type={'search'}
                        value={searchKeyword}
                        onChange={(e) => {
                            dispatch(actions.setKeyword(e.target.value));
                        }}
                        onKeyUp={searchForRaces}
                        placeholder={t(translations.home_page.map_view_tab.search_race_with_syrf)} />
                    <SearchBarLogo />
                    <StyledSpin spinning={isSearching}></StyledSpin>
                </SearchBarInnerWrapper>
                <AdvancedSearchTextWrapper>
                    <a href="/" onClick={(e) => {
                        e.preventDefault();
                        setShowSearchPanel(true);
                    }}>{t(translations.home_page.map_view_tab.advanced_search)}</a>
                </AdvancedSearchTextWrapper>
            </SearchBarWrapper>
            {showSearchPanel && <StyledSearchPane
                defaultFocus
                searchKeyWord={searchKeyword}
                closable
                close={() => setShowSearchPanel(false)} />}
            <MyLocationWrapper onClick={() => zoomToUserLocation()}>
                <StyledMyLocationIcon />
                <MyLocationText>{t(translations.home_page.map_view_tab.my_location)}</MyLocationText>
            </MyLocationWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
`;

const SearchBarWrapper = styled.div`
    position: absolute;
    bottom: 110px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 530px;
    max-width: 80%;
    z-index: 998;
`;

const SearchBarInnerWrapper = styled.div``;

const SearchBarLogo = styled(SYRFLogo)`
    position: absolute;
    left: 15px;
    top: 0px;
    width: 45px;
    height: 45px;
`;

const StyledSearchBar = styled(Input)`
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(9, 32, 77, 0.12), 0 0 2px rgba(29, 17, 51, 0.12);
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 70px;
    padding-right: 50px;

    ::placeholder {
        font - weight: 500;
    }
`;

const StyledSearchPane = styled(FilterPane)`
    position: absolute;
    bottom: 0;
    margin: 0 auto;
    background: #fff;
    border-radius: 8px;
    padding: 0 20px;
    display: block;
    border-top: 1px solid #eee;
    width: 97%;
    z-index: 999;

    ${media.medium`
        height: 300px;
        width: 530px;
    `}
`;

const AdvancedSearchTextWrapper = styled.div`
    text-align:right;
    margin-top: 5px;
    a {
        color: #fff;
        font-size: 12px;
        margin-left: 5px;
    }
`;

const StyledSpin = styled(Spin)`
    position: absolute;
    right: 15px;
    top: 12px;
`;

const MyLocationWrapper = styled.div`
    position: absolute;
    bottom: 80px;
    z-index: 999;
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