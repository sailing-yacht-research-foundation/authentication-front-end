import 'leaflet/dist/leaflet.css';

import React from 'react';
import { MapContainer } from 'react-leaflet';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { Playback } from './components/Playback';

const center = {
    lng: -125.688816,
    lat: 47.822007
}

const ZOOM = 13;

export const PlaybackPage = (props) => {
    return (
        <Wrapper>
            <MapContainer style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT})`, width: '100%' }} center={center} zoom={ZOOM}>
                <Playback zoom={ZOOM} />
            </MapContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;