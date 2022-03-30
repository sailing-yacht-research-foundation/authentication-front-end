import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { removeMemberFromTheGroup } from 'services/live-data-server/groups';
import { showToastMessageOnRequestError } from 'utils/helpers';

interface IRemoveMemberFromGroupModal {
    groupId: string,
    member: any,
    showModal: boolean,
    setShowModal: Function,
    onMemberRemoved: Function
}

export const RemoveMemberFromGroupModal = (props: IRemoveMemberFromGroupModal) => {

    const { t } = useTranslation();

    const {
        member,
        showModal,
        setShowModal,
        onMemberRemoved,
        groupId
    } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const performRemoveMember = async () => {
        setIsLoading(true);
        const response = await removeMemberFromTheGroup(groupId, member.id);
        setIsLoading(false);

        setShowModal(false);

        if (response.success) {
            toast.success(t(translations.group.successfully_removed_this_person_from_the_group, { memberName:member.member?.name }));
            onMemberRemoved();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal
            confirmLoading={isLoading}
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