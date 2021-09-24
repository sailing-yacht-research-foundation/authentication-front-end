import 'leaflet/dist/leaflet.css';

import React from 'react';
import { MapContainer } from 'react-leaflet';
import { Map } from './Map';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

const DEFAULT_ZOOM = 1;

export const LocationPicker = (props) => {

    const { onChoosedLocation, coordinates, zoom, height, locationDescription } = props;

    const { t } = useTranslation();

    const onMapClicked = (latitude, longitude) => {
        onChoosedLocation(latitude, longitude);
    }

    return (
        <Wrapper style={{height: height ? height : '450px'}}>
            <MapContainer style={{ height: `100%`, width: '100%', zIndex: 1 }} center={coordinates} zoom={DEFAULT_ZOOM}>
                <Map coordinates={coordinates} onMapClicked={onMapClicked} zoom={zoom ? zoom : DEFAULT_ZOOM} />
            </MapContainer>
            <PickerDescription>{ locationDescription ? locationDescription : t(translations.my_event_create_update_page.please_choose_a_location)}</PickerDescription>
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