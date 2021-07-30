import React from 'react';
import { StyleConstants } from 'styles/StyleConstants';
import { Input } from 'antd';
import styled from 'styled-components';
import { ReactComponent as SYRFLogo } from './assets/logo-dark.svg';
import { FilterPane } from '../FilterTab/components/FilterPane';
import { media } from 'styles/media';
import ReactMapGL from 'react-map-gl';
import { useEffect } from 'react';

const TAB_BAR_HEIGHT = '76px';

export const MapViewTab = () => {

    const [viewport, setViewport] = React.useState({
        latitude: 37.8,
        longitude: -122.4,
        zoom: 14,
        bearing: 0,
        pitch: 0
    });

    const [showSearchPanel, setShowSearchPanel] = React.useState<boolean>(false);

    const [searchKeyword, setSearchKeyWord] = React.useState<string>('');

    useEffect(() => {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(setViewPortPosition);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setViewPortPosition = (position) => {
        setViewport({
            ...viewport,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }

    return (
        <>
            <ReactMapGL
                {...viewport}
                width="100vw"
                height={`calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT} - ${TAB_BAR_HEIGHT})`}
                mapboxApiAccessToken={process.env.REACT_APP_MAP_BOX_API_KEY}
                mapStyle={'mapbox://styles/jweisbaum89/cki2dpc9a2s7919o8jqyh1gss'}
                onViewportChange={nextViewport => setViewport(nextViewport)}
            >
            </ReactMapGL>
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
        font-weight: 500;
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

    ${media.medium`
        height: 380px;
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