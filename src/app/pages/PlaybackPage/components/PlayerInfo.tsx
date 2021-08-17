import React from 'react';
import styled from 'styled-components';

export const PlayerInfo = (props) => {
    const { competitor_name, competitor_sail_number } = props.playerData;

    return (
        <div>
            <RacerInfoContainer>
                <RacerInfoTitle>
                    Competitor:
                </RacerInfoTitle>
                {competitor_name}
            </RacerInfoContainer>

            <RacerInfoContainer>
                <RacerInfoTitle>
                    Sail number:
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
