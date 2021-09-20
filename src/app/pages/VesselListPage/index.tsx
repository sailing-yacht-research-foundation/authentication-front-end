import { Wrapper } from 'app/components/SyrfGeneral';
import * as React from 'react';
import { VesselList } from './components/VesselList';

export function VesselListPage() {
    return (
        <>
            <Wrapper>
                <VesselList />
            </Wrapper>
        </>
    );
}