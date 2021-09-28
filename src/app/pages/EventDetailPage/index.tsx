import { Wrapper } from 'app/components/SyrfGeneral';
import * as React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';
import { EventDetail } from './components/EventDetail';

export function EventDetailPage() {
    return (
        <>
            <StyledWrapper>
                <EventDetail />
            </StyledWrapper>
        </>
    );
}

const StyledWrapper = styled(Wrapper)`
    padding: 0 0;
    margin-top: 100px;

    ${media.medium`
        padding: 0 50px;
    `}
`;