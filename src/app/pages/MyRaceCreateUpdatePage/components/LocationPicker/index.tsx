import React from 'react';
import { MapContainer } from 'react-leaflet';
import { Map } from './Map';
import styled from 'styled-components';

const DEFAULT_ZOOM = 1;

export const LocationPicker = (props) => {

    const { onChoosedLocation, coordinates } = props;

    const onMapClicked = (latitude, longitude) => {
        onChoosedLocation(latitude, longitude);
    }

    return (
        <Wrapper>
            <MapContainer style={{ height: `100%`, width: '100%', zIndex: 1 }} center={coordinates} zoom={DEFAULT_ZOOM}>
                <Map coordinates={coordinates} onMapClicked={onMapClicked} zoom={DEFAULT_ZOOM} />
            </MapContainer>
            <PickerDescription>Please choose a location by clicking on the map</PickerDescription>
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