import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { leaveGroup } from 'services/live-data-server/groups';
import { useHistory } from 'react-router';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const LeaveGroupModal = (props) => {

    const { t } = useTranslation();

    const {
        group,
        showModal,
        setShowModal,
    } = props;

    const history = useHistory();

    const performRemoveMember = async () => {
        const response = await leaveGroup(group.id);

        setShowModal(false);

        if (response.success) {
            toast.success(t(translations.group.leave_group_successfully));
            history.push('/groups');
        } else {
            if (response.error?.response?.status === 403) {
                toast.error(t(translations.group.please_assign_other_admin_before_leaving_the_group));
                return;
            }
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal
            title={t(translations.group.are_you_sure_you_want_to_leave_this_group)}
            visible={showModal}
            onOk={() => {
                performRemoveMember();
            }}
            onCancel={() => {
                setShowModal(false);
            }}>
            <ModalMessage>{t(translations.group.you_will_no_longer_see_any_posts_or_events)}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;