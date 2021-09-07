import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw-src.css';

import React from 'react';
import { MapContainer } from 'react-leaflet';
import { MAP_DEFAULT_VALUE } from 'utils/helpers';
import { Map } from './Map';
import styled from 'styled-components';

export const BoundingBoxPicker = (props) => {

    const { onCoordinatesRecevied, coordinates } = props;

    return (
        <Wrapper>
            <MapContainer style={{ height: `100%`, width: '100%', zIndex: 1 }} center={MAP_DEFAULT_VALUE.CENTER} zoom={MAP_DEFAULT_VALUE.ZOOM}>
                <Map coordinates={coordinates}  onCoordinatesRecevied={onCoordinatesRecevied} zoom={MAP_DEFAULT_VALUE.ZOOM} />
            </MapContainer>
            <PickerDescription>Please create a bounding box by drawing on the map</PickerDescription>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    height: 450px;
    padding: 30px 0;
    z-index: -1;
`;

const PickerDescription = styled.div`
    text-align: right;
    margin: 5px 0;
    font-size: 13px;
    color: #70757a;
`;