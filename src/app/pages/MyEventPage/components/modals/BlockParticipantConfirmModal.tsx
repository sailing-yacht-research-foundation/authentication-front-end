import React from 'react';
import { Modal } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { blockParticipant } from 'services/live-data-server/participants';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { Participant } from 'types/Participant';

interface IBlockParticipantConfirmModal {
    showModal: boolean,
    setShowModal: Function,
    participant: Partial<Participant>,
    reloadParent: Function
}

export const BlockParticipantConfirmModal = (props: IBlockParticipantConfirmModal) => {

    const { showModal, setShowModal, participant, reloadParent } = props;

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const block = async () => {
        setIsLoading(true);
        const response = await blockParticipant(participant.id!);
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.participant_list.successfully_blocked_this_participant));
            reloadParent();
            setShowModal(false);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal confirmLoading={isLoading} visible={showModal} onOk={block} onCancel={() => setShowModal(false)} title={t(translations.participant_list.block_participant)}>
            <span>{t(translations.participant_list.are_you_sure_you_want_to_block_this_participant)}</span>
        </Modal>
    )
}
