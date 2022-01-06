import React from 'react';
import { EventState, MODE } from 'utils/constants';
import { SyrfFormButton, SyrfFormWrapper } from 'app/components/SyrfForm';
import { CompetitionUnitList } from './CompetitionUnitList';
import { ParticipantList } from './ParticipantList';
import { VesselParticipantGroupList } from './VesselParticipantGroupList';
import { CoursesList } from './CoursesList';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { ConfirmPublishEventModal } from './modals/ConfirmPublishEventModal';

export const EventChildLists = ({ mode, eventId, event, raceListRef, setEvent }) => {

    const { t } = useTranslation();

    const [showConfirmPublishEventModal, setShowConfirmPublishEventModal] = React.useState<boolean>(false);

    return (<>
        <ConfirmPublishEventModal
            setEvent={setEvent}
            event={event}
            showModal={showConfirmPublishEventModal}
            setShowModal={setShowConfirmPublishEventModal} />
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


                    {
                        event.status === EventState.DRAFT && <SyrfFormWrapper style={{ margin: '30px 0' }}>
                            <SyrfFormButton onClick={() => setShowConfirmPublishEventModal(true)}>{t(translations.my_event_create_update_page.publish)}</SyrfFormButton>
                        </SyrfFormWrapper>
                    }
                </>
            )
        }

    </>)
}