import 'leaflet/dist/leaflet.css';

import React from 'react';
import { MapContainer } from 'react-leaflet';
import styled from 'styled-components';
import { Button, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { Map } from './Map';
import { checkIfLocationIsValid } from 'utils/helpers';

const DEFAULT_ZOOM = 3;
const options = [
    { label: "Start Location", value: "start" },
    { label: "End Location", value: "end" }
]

export const LocationPicker = (props) => {

    const {
        onChooseLocation,
        coordinates,
        endCoordinates,
        zoom,
        height,
        locationDescription,
        noMarkerInteraction,
        noPadding,
        onRemoveEndLocation,
        hideLocationControls,
        setFormChanged } = props;

    const { t } = useTranslation();

    const [selectedOpt, setSelectedOpt] = React.useState(options[0].value);

    const onMapClicked = (latitude, longitude, selector) => {
        if (onChooseLocation)
            onChooseLocation(latitude, longitude, selector);
    }

    const handleChangeOption = (e) => {
        setSelectedOpt(e.target.value)
    };

    const handleRemoveEndLocation = () => {
        if (onRemoveEndLocation) onRemoveEndLocation();
    }

    const canShowPicker = checkIfLocationIsValid(coordinates.lng, coordinates.lat);


    if (canShowPicker)
        return (
            <div style={{ position: "relative" }}>
                {!hideLocationControls && <Radio.Group options={options} onChange={handleChangeOption} optionType="button" buttonStyle="solid" value={selectedOpt} />}
                <Wrapper style={{ height: height || '450px', padding: noPadding ? '0' : '30px 0' }}>
                    {
                        endCoordinates && !hideLocationControls &&
                        <RemoveLocationButton onClick={handleRemoveEndLocation}>Remove End Location</RemoveLocationButton>
                    }
                    <MapContainer style={{ height: `100%`, width: '100%', zIndex: 1 }} center={coordinates} zoom={DEFAULT_ZOOM}>
                        <Map option={selectedOpt} setFormChanged={setFormChanged} noMarkerInteraction={noMarkerInteraction || false} coordinates={coordinates} endCoordinates={endCoordinates} onMapClicked={onMapClicked} zoom={zoom || DEFAULT_ZOOM} />
                    </MapContainer>
                    <PickerDescription>{locationDescription || t(translations.my_event_create_update_page.please_choose_a_location)}</PickerDescription>
                </Wrapper>
            </div>
        )

    return <></>;
}

const Wrapper = styled.div`
    width: 100%;
    height: 450px;
    z-index: -1;
`;

const PickerDescription = styled.div`
    text-align: right;
    margin: 5px 0;
    font-size: 13px;
    color: #70757a;
`;

const RemoveLocationButton = styled(Button)`
    z-index: 3;
    position: absolute;
    right: 12px;
    top: 76px;
`;
