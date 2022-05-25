import { Modal } from 'antd';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { shareInformationAfterJoinedEvent } from 'services/live-data-server/participants';
import { CalendarEvent } from 'types/CalendarEvent';
import { showToastMessageOnRequestError } from 'utils/helpers';

interface IConfirmSharingInformationModal {
    showModal: boolean;
    setShowModal: any;
    event: Partial<CalendarEvent>,
    requiredInformation: any[],
    reloadParent: Function
}

export const ConfirmSharingInformationModal = ({ showModal, setShowModal, event, requiredInformation, reloadParent }: IConfirmSharingInformationModal) => {

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const shareInformation = async () => {
        setIsLoading(true);
        const response = await shareInformationAfterJoinedEvent(event.participantDetail?.participantId, true);
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.event_detail_page.successfully_shared_your_information_with_the_organizer))
            setShowModal(false);
            reloadParent();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal visible={showModal}
            okText={t(translations.event_detail_page.accept)}
            title={t(translations.event_detail_page.share_information_to_the_organizers)}
            onOk={shareInformation}
            confirmLoading={isLoading}
            onCancel={() => setShowModal(false)}
        >
            <h4>{t(translations.event_detail_page.by_clicking_the_accept_button_you_will_share_the_following_information_to_the_organizer)}</h4>
            <ul>
                {requiredInformation.map(information => information)}
            </ul>
        </Modal>
    )
}