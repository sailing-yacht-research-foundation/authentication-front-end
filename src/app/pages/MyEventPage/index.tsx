import { Wrapper } from 'app/components/SyrfGeneral';
import * as React from 'react';
import { MyEvents } from './components/MyEvents';

export function MyEventPage() {
    return (
        <>
            <Wrapper>
                <MyEvents />
            </Wrapper>
        </>
    );
}