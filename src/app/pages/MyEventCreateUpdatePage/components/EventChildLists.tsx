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
import styled from 'styled-components';
import { media } from 'styles/media';

export const EventChildLists = ({ mode, eventId, event, raceListRef, pdfListRef, setEvent, reloadParent }) => {

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
                    <PdfWrapper style={{ width: '100%' }} ref={pdfListRef}>
                        <PDFUploadForm event={event} reloadParent={reloadParent} />
                    </PdfWrapper>

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

                    {
                        event.status === EventState.DRAFT && <SyrfFormWrapper>
                            <SyrfFormButton onClick={() => setShowConfirmPublishEventModal(true)}>{t(translations.my_event_create_update_page.make_public)}</SyrfFormButton>
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

const PdfWrapper = styled.div`
    ${media.medium`
        width: 100%;
        padding: 30px 56px;
    `}
`;