import { Wrapper } from 'app/components/SyrfGeneral';
import * as React from 'react';
import { MyRaces } from './components/MyEvents';

export function MyEventPage() {
    return (
        <>
            <Wrapper>
                <MyRaces />
            </Wrapper>
        </>
    );
}