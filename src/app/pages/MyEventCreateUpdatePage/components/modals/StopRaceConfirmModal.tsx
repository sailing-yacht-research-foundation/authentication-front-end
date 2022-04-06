import React from 'react';
import { Modal } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { stopRace } from 'services/live-data-server/competition-units';
import { CompetitionUnit } from 'types/CompetitionUnit';

interface IStopRaceConfirmModal {
    showModal: boolean,
    setShowModal: Function,
    race: Partial<CompetitionUnit>,
    reloadParent?: Function
}


export const StopRaceConfirmModal = (props: IStopRaceConfirmModal) => {

    const { showModal, setShowModal, race, reloadParent } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const stopTheRace = async () => {
        setIsLoading(true);
        const response = await stopRace(race.id!);
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.my_event_create_update_page.stopped_the_race));
            setShowModal(false);
            if (reloadParent)
                reloadParent();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal
            confirmLoading={isLoading}
            visible={showModal}
            onOk={stopTheRace}
            onCancel={() => setShowModal(false)}
            title={t(translations.my_event_create_update_page.stop_this_race)}>
            <span>{t(translations.my_event_create_update_page.are_you_sure_you_want_to_stop_this_race)}</span>
        </Modal>
    )
}