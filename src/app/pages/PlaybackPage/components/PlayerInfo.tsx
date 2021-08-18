import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export const PlayerInfo = (props) => {
    const { competitor_name, competitor_sail_number } = props.playerData;

    const { t } = useTranslation();

    return (
        <div>
            <RacerInfoContainer>
                <RacerInfoTitle>
                    {t(translations.playback_page.competitor)}
                </RacerInfoTitle>
                {competitor_name}
            </RacerInfoContainer>

            <RacerInfoContainer>
                <RacerInfoTitle>
                    {t(translations.playback_page.sail_number)}
                </RacerInfoTitle>
                {competitor_sail_number}
            </RacerInfoContainer>
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
