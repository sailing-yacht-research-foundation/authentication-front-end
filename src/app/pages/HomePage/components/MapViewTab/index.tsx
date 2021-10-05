import 'leaflet/dist/leaflet.css';

import React, { useRef } from 'react';
import { Input, Pagination, Spin } from 'antd';
import styled from 'styled-components';
import { ReactComponent as SYRFLogo } from '../assets/logo-dark.svg';
import { media } from 'styles/media';
import { MapContainer, } from 'react-leaflet';
import { MapView } from './MapView';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsSearching, selectPage, selectPageSize, selectResults, selectSearchKeyword, selectTotal } from '../../slice/selectors';
import { useHomeSlice } from '../../slice';
import { BiTargetLock } from 'react-icons/bi';
import { useHistory } from 'react-router';
import { StyleConstants } from 'styles/StyleConstants';

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

    const searchKeyword = useSelector(selectSearchKeyword);

    const mapViewRef = useRef<MapViewProps>(null);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const isSearching = useSelector(selectIsSearching);

    const total = useSelector(selectTotal);

    const page = useSelector(selectPage);

    const pageSize = useSelector(selectPageSize);

    const results = useSelector(selectResults);

    const history = useHistory();

    const [isFocusingOnSearchInput, setIsFocusingOnSearchInput] = React.useState<boolean>(false);

    const searchForRaces = (e) => {
        if (e.keyCode === 13 || e.which === 13) {
            const params: any = {};
            params.keyword = searchKeyword;
            params.size = pageSize;

            dispatch(actions.setPage(1));
            dispatch(actions.setKeyword(params.keyword ?? ''));
            dispatch(actions.setFromDate(''));
            dispatch(actions.setToDate(''));
            dispatch(actions.searchRaces(params));

            history.push({
                pathname: '/',
                search: Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')
            });
            window.scrollTo(0, 0);
        }
    }

    const zoomToUserLocation = () => {
        if (null !== mapViewRef.current) {
            mapViewRef.current.zoomToCurrentUserLocationIfAllowed();
        }
    }

    const handleOnSearchInputFocus = () => {
        window.scrollTo(0, 0);
        setIsFocusingOnSearchInput(true);
    }

    const handleOnSearchInputBlur = () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        setIsFocusingOnSearchInput(false);
    }

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Wrapper>
            <MapContainer style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT} - ${StyleConstants.TAB_BAR_HEIGHT})`, width: '100%', zIndex: 1 }} center={center} zoom={ZOOM}>
                <MapView isFocusingOnSearchInput={isFocusingOnSearchInput} ref={mapViewRef} zoom={ZOOM} />
            </MapContainer>
            {
                results.length > 0 && <PaginationWrapper>
                    <Pagination defaultCurrent={1} current={page} onChange={onPaginationPageChanged} total={total} pageSize={pageSize} />
                </PaginationWrapper>
            }
            <SearchBarWrapper>
                <SearchBarInnerWrapper>
                    <StyledSearchBar
                        type={'search'}
                        value={searchKeyword}
                        onChange={(e) => {
                            dispatch(actions.setKeyword(e.target.value));
                        }}
                        onKeyUp={searchForRaces}
                        onFocus={handleOnSearchInputFocus}
                        onBlur={handleOnSearchInputBlur}
                        placeholder={t(translations.home_page.map_view_tab.search_race_with_syrf)} />
                    <SearchBarLogo />
                    <StyledSpin spinning={isSearching}></StyledSpin>
                </SearchBarInnerWrapper>
                <AdvancedSearchTextWrapper>
                    <a href="/" onClick={(e) => {
                        e.preventDefault();
                        dispatch(actions.setShowAdvancedSearch(true));
                    }}>{t(translations.home_page.map_view_tab.advanced_search)}</a>
                </AdvancedSearchTextWrapper>
            </SearchBarWrapper>
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
    bottom: 50px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 570px;
    max-width: 80%;
    z-index: 10;
`;

const SearchBarInnerWrapper = styled.div`
    position: relative;
`;

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
    white-space:nowrap;
    text-overflow:ellipsis;

    ::placeholder {
        font-weight: 500;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
`;

const AdvancedSearchTextWrapper = styled.div`
    text-align:right;
    margin-top: 5px;
    a {
        color: #fff;
        font-size: 12px;
        margin-left: 5px;
    }
    display: block;

    ${media.medium`
        display: none;
    `};
`;

const StyledSpin = styled(Spin)`
    position: absolute;
    right: 15px;
    top: 12px;
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