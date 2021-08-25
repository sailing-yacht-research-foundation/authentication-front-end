import React from 'react';
import { MapContainer } from 'react-leaflet';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { MapView } from './MapView';

const center = {
    lng: -122.4,
    lat: 37.8
}

const ZOOM = 13;

export const MapViewTab = () => {

    return (
        <Wrapper>
            <MapContainer style={{ height: `calc(101vh - ${StyleConstants.NAV_BAR_HEIGHT} - ${StyleConstants.TAB_BAR_HEIGHT})`, width: 'calc(100%)' }} center={center} zoom={ZOOM}>
                <MapView />
            </MapContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
`;