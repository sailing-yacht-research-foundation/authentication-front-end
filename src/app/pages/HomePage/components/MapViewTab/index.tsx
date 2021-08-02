// import 'leaflet/dist/leaflet.css';

import React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';
import { ReactComponent as SYRFLogo } from '../assets/logo-dark.svg';
import { FilterPane } from '../../FilterTab/components/FilterPane';
import { media } from 'styles/media';
import { MapContainer, } from 'react-leaflet';
import { MapView } from './MapView';
import { StyleConstants } from 'styles/StyleConstants';

const TAB_BAR_HEIGHT = '76px';

const center = {
    lng: -122.4,
    lat: 37.8
}

const ZOOM = 13;

export const MapViewTab = () => {

    const [showSearchPanel, setShowSearchPanel] = React.useState<boolean>(false);

    const [searchKeyword, setSearchKeyWord] = React.useState<string>('');

    return (
        <>
            <MapContainer style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT} - ${TAB_BAR_HEIGHT})`, width: '100wh' }} center={center} zoom={ZOOM}>
                <MapView zoom={ZOOM} />
            </MapContainer>
            <SearchBarWrapper>
                <SearchBarInnerWrapper>
                    <StyledSearchBar
                        type={'search'}
                        value={searchKeyword}
                        onChange={(e) => {
                            setSearchKeyWord(e.target.value);
                        }}
                        placeholder={'Search races with SYRF'} />
                    <SearchBarLogo />
                </SearchBarInnerWrapper>
                <AdvancedSearchTextWrapper>
                    <a href="/" onClick={(e) => {
                        e.preventDefault();
                        setShowSearchPanel(true);
                    }}>Advanced search?</a>
                </AdvancedSearchTextWrapper>
            </SearchBarWrapper>
            {showSearchPanel && <StyledSearchPane
                defaultFocus
                searchKeyWord={searchKeyword}
                closable
                close={() => setShowSearchPanel(false)} />}
        </>
    )
}

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
    text-indent: 60px;

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