import { Wrapper } from 'app/components/SyrfGeneral';
import * as React from 'react';
import { VesselParticipantGroupList } from './components/VesselParticipantGroupList';

export function VesselParticipantGroupListPage() {
    return (
        <>
            <Wrapper>
                <VesselParticipantGroupList />
            </Wrapper>
        </>
    );
}