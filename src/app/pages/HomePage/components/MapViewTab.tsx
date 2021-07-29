import React from 'react';
import { StyleConstants } from 'styles/StyleConstants';
import { Input } from 'antd';
import styled from 'styled-components';
import { ReactComponent as SYRFLogo } from './assets/logo-dark.svg';
import { FilterPane } from '../FilterTab/components/FilterPane';
import { media } from 'styles/media';
import ReactMapGL from 'react-map-gl';
import { useEffect } from 'react';

interface StyledSearchBarProps {
    onClick: (e: Event) => void;
    onFocus: (e: Event) => void;
}

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
                <StyledSearchBar
                    onClick={e => setShowSearchPanel(true)}
                    onFocus={e => setShowSearchPanel(true)}
                    placeholder={'Search races with SYRF'} />
                <SearchBarLogo />
            </SearchBarWrapper>
            {showSearchPanel && <StyledSearchPane closable close={() => setShowSearchPanel(false)} />}
        </>
    )
}

const SearchBarWrapper = styled.div`
    position: absolute;
    bottom: 70px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 530px;
    max-width: 80%;
`;

const SearchBarLogo = styled(SYRFLogo)`
    position: absolute;
    left: 15px;
    top: 0px;
    width: 45px;
    height: 45px;
`;

const StyledSearchBar = styled(Input) <StyledSearchBarProps>`
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
    left: 0;
    right: 0;
    margin: 0 auto;
    background: #fff;
    border-radius: 8px;
    padding: 0 20px;
    display: block;
    border-top: 1px solid #eee;
    width: 100%;

    ${media.medium`
        height: 380px;
        width: 530px;
    `}
`;