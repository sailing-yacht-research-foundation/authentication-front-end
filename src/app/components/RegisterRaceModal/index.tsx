import React from 'react';
import { Modal, Form} from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { joinCompetitionUnit } from 'services/live-data-server/open-competition';
import { FormContent } from './FormContent';

interface IRegisterRaceModal {
    showModal: boolean
    setShowModal: Function,
    eventName: string,
    raceId: string,
    lon: number,
    lat: number,
    setRelation?: Function,
    eventId: string,
}

export const RegisterRaceModal = ({ showModal, setShowModal, eventName, raceId, lon, lat, setRelation, eventId }: IRegisterRaceModal) => {

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [form] = Form.useForm();

    const hideModal = () => {
        setShowModal(false);
    }

    const onFinish = async (values) => {
        const { vesselId, allowShareInformation, sailNumber } = values;

        setIsLoading(true);
        const response = await joinCompetitionUnit(raceId, vesselId, sailNumber, allowShareInformation, lon, lat);
        setIsLoading(false);

        if (response.success) {
            hideModal();
            toast.success(t(translations.home_page.successfully_registered_to_join_this_competition));
            if (setRelation) setRelation({
                isParticipant: true
            });
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (<Modal
        title={t(translations.my_event_list_page.register_for, { name: eventName })}
        bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
        visible={showModal}
        footer={null}
        onCancel={hideModal}
    >
        <FormContent eventId={eventId} form={form} isLoading={isLoading} onFinish={onFinish} setShowModal={setShowModal} showModal={showModal} t={t} />
    </Modal >);
}
