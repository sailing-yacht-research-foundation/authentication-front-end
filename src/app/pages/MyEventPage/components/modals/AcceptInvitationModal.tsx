import React from 'react';
import { Modal, Form } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { acceptInvitation } from 'services/live-data-server/participants';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useMyEventListSlice } from '../../slice';
import { FormContent } from 'app/components/RegisterRaceModal/FormContent';

export const AcceptInvitationModal = (props) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, request, reloadParent } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const { actions } = useMyEventListSlice();

    const hideModal = () => {
        setShowModal(false);
        if (reloadParent) {
            reloadParent();
        }
    }

    const onFinish = async (values) => {
        const { vesselId, sailNumber, allowShareInformation } = values;

        setIsLoading(true);
        const response = await acceptInvitation(request?.id, vesselId, sailNumber, allowShareInformation);
        setIsLoading(false);

        if (response.success) {
            hideModal();
            dispatch(actions.getEvents({ page: 1, size: 10 }));
            toast.success(t(translations.my_event_list_page.accepted_the_request));
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (<Modal
        title={t(translations.my_event_list_page.register_for, { name: request.event?.name })}
        bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
        visible={showModal}
        footer={null}
        onCancel={hideModal}
    >
        <FormContent eventId={request.event?.id} form={form} isLoading={isLoading} onFinish={onFinish} setShowModal={setShowModal} showModal={showModal} t={t} />
    </Modal >);
}
