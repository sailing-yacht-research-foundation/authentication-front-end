import React from 'react';
import { MapContainer } from 'react-leaflet';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { MAP_DEFAULT_VALUE } from 'utils/helpers';
import { MapView } from './MapView';

export const MapViewTab = () => {

    return (
        <Wrapper>
            <MapContainer style={{ height: `calc(101vh - ${StyleConstants.NAV_BAR_HEIGHT} - ${StyleConstants.TAB_BAR_HEIGHT})`, width: 'calc(100%)' }} center={MAP_DEFAULT_VALUE.CENTER} zoom={MAP_DEFAULT_VALUE.ZOOM}>
                <MapView />
            </MapContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
`;