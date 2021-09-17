import { Wrapper } from 'app/components/SyrfGeneral';
import * as React from 'react';
import { CompetitionUnitList } from './components/CompetitionUnitList';

export function CompetitionUnitListPage() {
    return (
        <>
            <Wrapper>
                <CompetitionUnitList />
            </Wrapper>
        </>
    );
}