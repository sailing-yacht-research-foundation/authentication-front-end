import React from 'react';
import { MODE } from 'utils/constants';
import { SyrfFormWrapper } from 'app/components/SyrfForm';
import { CompetitionUnitList } from './CompetitionUnitList';
import { ParticipantList } from './ParticipantList';
import { VesselParticipantGroupList } from './VesselParticipantGroupList';
import { CoursesList } from './CoursesList';

export const EventChildLists = ({mode, eventId, event, raceListRef}) => {
    return (<>
        {
            mode === MODE.UPDATE && (
                <>
                    <SyrfFormWrapper ref={raceListRef} style={{ marginTop: '30px' }}>
                        <CompetitionUnitList eventId={eventId || event.id} />
                    </SyrfFormWrapper>

                    <SyrfFormWrapper style={{ marginTop: '30px' }}>
                        <VesselParticipantGroupList eventId={eventId || event.id} />
                    </SyrfFormWrapper>

                    <SyrfFormWrapper style={{ marginTop: '30px' }}>
                        <ParticipantList event={event} eventId={eventId || event.id} />
                    </SyrfFormWrapper>

                    <SyrfFormWrapper style={{ marginTop: '30px' }}>
                        <CoursesList eventId={eventId || event.id} />
                    </SyrfFormWrapper>
                </>
            )
        }

    </>)
}