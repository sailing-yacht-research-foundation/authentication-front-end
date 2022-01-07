import React from 'react';
import { Modal } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { stopRace } from 'services/live-data-server/competition-units';

export const StopRaceConfirmModal = (props) => {

    const { showModal, setShowModal, race, reloadParent } = props;

    const { t } = useTranslation();

    const stopTheRace = async () => {
        const response = await stopRace(race.id);

        if (response.success) {
            toast.success(t(translations.my_event_create_update_page.stopped_the_race));
            setShowModal(false);
            reloadParent();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal visible={showModal} onOk={stopTheRace} onCancel={() => setShowModal(false)} title={t(translations.my_event_create_update_page.stop_this_race)}>
            <span>{t(translations.my_event_create_update_page.are_you_sure_you_want_to_stop_this_race)}</span>
        </Modal>
    )
}