import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { getUserAttribute } from 'utils/user-utils';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const EditEmailChangeModal = (props) => {

    const { t } = useTranslation();

    const { showEmailChangeAlertModal,
        formFieldsBeforeUpdate,
        defaultFormFields,
        authUser,
        form,
        updateUserInfo,
        setShowEmailChangeAlertModal,
        setFormFieldsBeforeUpdate } = props;

    return (
        <Modal title={t(translations.profile_page.update_profile.email_change_confirmation)}
            visible={showEmailChangeAlertModal}
            onOk={() => {
                updateUserInfo(formFieldsBeforeUpdate);
                setShowEmailChangeAlertModal(false);
            }}
            onCancel={() => {
                setShowEmailChangeAlertModal(false);
                setFormFieldsBeforeUpdate(defaultFormFields);
                form.setFieldsValue({ // reset the email to the last state.
                    email: getUserAttribute(authUser, 'email')
                });
            }}>
            <EmailChangeMessageText>
                {t(translations.profile_page.update_profile.hey_your_about_to_change_your_email, { name: getUserAttribute(authUser, 'name') })}
            </EmailChangeMessageText>
        </Modal>
    )
}

const EmailChangeMessageText = styled.div`
margin-bottom: 10px;
color: #f81d22;
`;