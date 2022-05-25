import React from 'react';
import { Alert, Button } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { CalendarEvent } from 'types/CalendarEvent';
import { requiredCompetitorsInformation } from 'utils/constants';
import { renderRequirementBasedOnEventKey } from 'utils/helpers';
import { ConfirmSharingInformationModal } from './ConfirmSharingInformationModal';

export const InformationNotShared = ({ event, reloadParent }: { event: Partial<CalendarEvent>, reloadParent: Function }) => {

    const { t } = useTranslation();

    const [isShowSharingInformationConfirmModal, setIsShowSharingInformationConfirmModal] = React.useState<boolean>(false);

    const requiredInformation: any = [];

    Object.keys(event).forEach(key => {
        if (requiredCompetitorsInformation.includes(key) && event[key] === true)
            requiredInformation.push(<li>{renderRequirementBasedOnEventKey(t, key)}</li>);
    });

    if (event.isParticipant
        && !event.participantDetail?.allowShareInformation
        && requiredInformation.length > 0)
        return (
            <Wrapper>
                <ConfirmSharingInformationModal
                    setShowModal={setIsShowSharingInformationConfirmModal}
                    showModal={isShowSharingInformationConfirmModal}
                    event={event}
                    reloadParent={reloadParent}
                    requiredInformation={requiredInformation} />
                <Alert
                    message={t(translations.event_detail_page.this_event_requires_some_of_your_profile_information_click_share_now_if_you_want_to_share_them_with_the_organizer)}
                    type="warning"
                    closable
                    action={
                        <Button type='link' onClick={() => setIsShowSharingInformationConfirmModal(true)}>{t(translations.event_detail_page.share_now)}</Button>
                    }
                />
            </Wrapper>
        );

    return (<></>);
}

const Wrapper = styled.div`
    margin: 10px 0;
    margin-top: 15px;
`;