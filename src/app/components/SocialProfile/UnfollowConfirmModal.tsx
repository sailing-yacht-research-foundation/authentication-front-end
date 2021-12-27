import React from 'react';
import { Modal } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export const UnfollowConfirmModal = (props) => {

    const { profileName, unfollow, hideModal, visible } = props;

    const { t } = useTranslation();

    return (
        <Modal visible={visible} onOk={unfollow} onCancel={hideModal} title={t(translations.public_profile.unfollow_people, { profileName: profileName })}>
            <span>{t(translations.public_profile.are_you_sure_to_unfollow, { profileName: profileName })}</span>
        </Modal>
    )
}