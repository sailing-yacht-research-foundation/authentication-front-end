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
import { ConfirmStopEventModal } from './modals/ConfirmStopEventModal';
import { PDFUploadForm } from './PDFUploadForm';

export const EventChildLists = ({ mode, eventId, event, raceListRef, setEvent, reloadParent }) => {

    const { t } = useTranslation();

    const [showConfirmPublishEventModal, setShowConfirmPublishEventModal] = React.useState<boolean>(false);
    const [showConfirmStopEventModal, setShowConfirmStopEventModal] = React.useState<boolean>(false);

    return (<>
        <ConfirmPublishEventModal
            setEvent={setEvent}
            event={event}
            showModal={showConfirmPublishEventModal}
            setShowModal={setShowConfirmPublishEventModal} />
        <ConfirmStopEventModal
            showModal={showConfirmStopEventModal}
            setShowModal={setShowConfirmStopEventModal}
            reloadParent={reloadParent}
            event={event} />
        {
            mode === MODE.UPDATE && (
                <>
                    <SyrfFormWrapper ref={raceListRef}>
                        <CompetitionUnitList event={event} eventId={eventId || event.id} />
                    </SyrfFormWrapper>

                    <SyrfFormWrapper>
                        <VesselParticipantGroupList eventId={eventId || event.id} />
                    </SyrfFormWrapper>

                    <SyrfFormWrapper>
                        <CoursesList eventId={eventId || event.id} />
                    </SyrfFormWrapper>

                    <SyrfFormWrapper>
                        <ParticipantList event={event} eventId={eventId || event.id} />
                    </SyrfFormWrapper>

                    <PDFUploadForm event={event} reloadParent={reloadParent} />

                    {
                        event.status === EventState.DRAFT && <SyrfFormWrapper>
                            <SyrfFormButton onClick={() => setShowConfirmPublishEventModal(true)}>{t(translations.my_event_create_update_page.publish)}</SyrfFormButton>
                        </SyrfFormWrapper>
                    }

                    {
                        event.status === EventState.ON_GOING && <SyrfFormWrapper>
                            <SyrfFormButton onClick={() => setShowConfirmStopEventModal(true)}>{t(translations.my_event_create_update_page.stop)}</SyrfFormButton>
                        </SyrfFormWrapper>
                    }
                </>
            )
        }

    </>)
}