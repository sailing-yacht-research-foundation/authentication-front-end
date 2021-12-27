import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { removeAsAdmin } from 'services/live-data-server/groups';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const RemoveAsAdminModal = (props) => {

    const { t } = useTranslation();

    const {
        groupId,
        member,
        showModal,
        setShowModal,
        onAdminRemoved
    } = props;

    const performRemoveAsAdmin = async () => {
        const response = await removeAsAdmin(groupId, member.id);

        setShowModal(false);

        if (response.success) {
            toast.success(t(translations.group.successfully_remove_person_as_admin, { memberName: member?.member?.name }));
            onAdminRemoved();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal
            title={t(translations.group.are_you_sure_you_want_to_remove_this_admin)}
            visible={showModal}
            onOk={() => {
                performRemoveAsAdmin();
            }}
            onCancel={() => {
                setShowModal(false);
            }}>
            <ModalMessage>{t(translations.group.this_person_will_no_longer_can, { memberName: member?.member?.name })}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;