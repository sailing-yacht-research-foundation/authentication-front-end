import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { removeMemberFromTheGroup } from 'services/live-data-server/groups';

export const RemoveMemberFromGroupModal = (props) => {

    const { t } = useTranslation();

    const {
        member,
        showModal,
        setShowModal,
        onMemberRemoved,
        groupId
    } = props;

    const performRemoveMember = async () => {
        const response = await removeMemberFromTheGroup(groupId, member.id);

        setShowModal(false);

        if (response.success) {
            toast.success(t(translations.group.successfully_removed_this_person_from_the_group, { memberName:member.member?.name }));
            onMemberRemoved();
        } else {
            toast.error(t(translations.group.an_error_happened_when_performing_your_request));
        }
    }

    return (
        <Modal
            title={t(translations.group.are_you_sure_you_want_to_remove_person_out_of_this_group, { memberName: member.member?.name })}
            visible={showModal}
            onOk={() => {
                performRemoveMember();
            }}
            onCancel={() => {
                setShowModal(false);
            }}>
            <ModalMessage>{t(translations.group.this_people_will_no_longer_see_any, { memberName: member.member?.name })}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;