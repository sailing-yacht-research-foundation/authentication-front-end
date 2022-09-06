import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export const PlayerInfo = (props) => {
    const { sailNumber } = props;
    const { competitor_name } = props.playerData;
    const { coordinate } = props;

    const { t } = useTranslation();

    const isCoordinateExist = !!(coordinate.lat || coordinate.lon);
    const coordinateElement = isCoordinateExist ? (
        <RacerInfoContainer>
            <hr/>
            <RacerInfoTitle>
                {t(translations.playback_page.coordinate)}
                <span style={{ color: '#999' }}>{t(translations.playback_page.lat_lon)}</span>:
            </RacerInfoTitle>
            <br />
            [{coordinate.lat}, {coordinate.lon}]
        </RacerInfoContainer>
    ) : undefined;

    return (
        <div>
            <RacerInfoContainer>
                <RacerInfoTitle>
                    {t(translations.playback_page.competitor)}
                </RacerInfoTitle>
                {competitor_name}
            </RacerInfoContainer>

            {sailNumber &&
                <RacerInfoContainer>
                    <RacerInfoTitle>
                        {t(translations.playback_page.sail_number)}
                    </RacerInfoTitle>
                    {sailNumber}
                </RacerInfoContainer>
            }

            {coordinateElement}
        </div>
    );
}

const RacerInfoContainer = styled.div`
    font-size: 14px;
`;

const RacerInfoTitle = styled.span`
    font-weight: bold;
    margin-right: 5px;
`;
