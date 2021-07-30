import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { getUserAttribute } from 'utils/user-utils';

export const EditEmailChangeModal = (props) => {

    const { showEmailChangeAlertModal,
        formFieldsBeforeUpdate,
        defaultFormFields,
        authUser,
        form,
        updateUserInfo,
        setShowEmailChangeAlertModal,
        setFormFieldsBeforeUpdate } = props;

    return (
        <Modal title="Email change confirmation"
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
                Hey {getUserAttribute(authUser, 'name')}, You're about to change your email (username).
                You have to make sure that the new changed email is your email otherwise you will not be able to login the next time.
                You will have to re-verify your email once again in the next login, do you really want to change your email?
            </EmailChangeMessageText>
        </Modal>
    )
}

const EmailChangeMessageText = styled.div`
margin-bottom: 10px;
color: #f81d22;
`;