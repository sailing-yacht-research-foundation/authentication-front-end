import React from 'react';
import { MapViewTab } from './MapViewTab/index';
import { Wrapper } from 'app/components/SyrfGeneral';

export const CourseCreate = () => {
    React.useEffect(() => {
        window.scroll(0, 0);
    },[]);

    return (
        <Wrapper>
            <MapViewTab />
        </Wrapper>
    );
}