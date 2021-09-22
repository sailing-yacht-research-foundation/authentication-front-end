import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw-src.css';

import React from 'react';
import { MapContainer } from 'react-leaflet';
import { MAP_DEFAULT_VALUE } from 'utils/constants';
import { Map } from './Map';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const BoundingBoxPicker = (props) => {

    const { onCoordinatesRecevied, coordinates } = props;

    const { t } = useTranslation();

    return (
        <Wrapper>
            <BoundingBoxPickerHeading>{t(translations.competition_unit_create_update_page.create_a_private_polygon)}</BoundingBoxPickerHeading>
            <BoundingPickerDescription>{t(translations.competition_unit_create_update_page.positions_outside_of_this_polygon_is)}</BoundingPickerDescription>
            <MapContainer style={{ height: `100%`, width: '100%', zIndex: 1 }} center={MAP_DEFAULT_VALUE.CENTER} zoom={MAP_DEFAULT_VALUE.ZOOM}>
                <Map coordinates={coordinates} onCoordinatesRecevied={onCoordinatesRecevied} zoom={MAP_DEFAULT_VALUE.ZOOM} />
            </MapContainer>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    height: 450px;
    padding: 30px 0;
    z-index: -1;
    margin-bottom: 100px;
`;

const BoundingBoxPickerHeading = styled.h3`
    
`;

const BoundingPickerDescription = styled.p`

`;