import React from 'react';
import { Modal } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { rejectInvitation } from 'services/live-data-server/participants';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';

export const RejectInviteRequestModal = (props) => {

    const { showModal, setShowModal, request, reloadParent } = props;

    const { t } = useTranslation();

    const reject = async () => {
        const response = await rejectInvitation(request.id);

        if (response.success) {
            toast.success(t(translations.my_event_list_page.successfully_rejected_this_invitation));
            reloadParent();
            setShowModal(false);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal visible={showModal} onOk={reject} onCancel={() => setShowModal(false)} title={t(translations.my_event_list_page.reject_invitation)}>
            <span>{t(translations.my_event_list_page.are_you_sure_you_want_to_reject_this_invitation)}</span>
        </Modal>
    )
}