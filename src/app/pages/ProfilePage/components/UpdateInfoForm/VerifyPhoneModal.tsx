import React from 'react';
import { Modal, Form } from 'antd';
import {
    SyrfFieldLabel,
    SyrfInputField,
} from 'app/components/SyrfForm';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export const VerifyPhoneModal = (props) => {

    const { t } = useTranslation();

    const {
        showPhoneVerifyModal,
        setShowPhoneVerifyModal,
        sendPhoneVerification,
        cancelUpdateProfile, message,
        setPhoneVerifyModalMessage
    } = props;

    const [verifyPhoneForm] = Form.useForm();

    const verifyFormAndPhoneNumber = () => {
        verifyPhoneForm
            .validateFields()
            .then(values => {
                const { code } = values;

                Auth.verifyCurrentUserAttributeSubmit('phone_number', String(code)).then(() => {
                    toast.success('Your phone number has been verified.');
                    verifyPhoneForm.resetFields();
                    setShowPhoneVerifyModal(false);
                    cancelUpdateProfile();
                })
                    .catch(error => {
                        toast.error(error.message);
                        verifyPhoneForm.resetFields();
                    })
            })
            .catch(info => {
            });
    }

    return (
        <Modal
            title={t(translations.profile_page.update_profile.please_verify_your_phone_number)}
            visible={showPhoneVerifyModal}
            onOk={() => {
                verifyFormAndPhoneNumber();
            }}
            onCancel={() => {
                setPhoneVerifyModalMessage('');
                setShowPhoneVerifyModal(false);
            }}>
            <ModalMessage>{message}</ModalMessage>
            <Form
                form={verifyPhoneForm}
                layout="vertical"
                name="basic"
                initialValues={{
                    code: '',
                }}
            >
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.code)}</SyrfFieldLabel>}
                    name="code"
                    rules={[{ required: true, min: 6 }]}
                >
                    <SyrfInputField
                        placeholder={t(translations.profile_page.update_profile.enter_the_code_you_received)}
                        type="number"
                    />
                </Form.Item>
            </Form>

            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <span>{t(translations.profile_page.update_profile.could_not_receive_the_code)} &nbsp; <a style={{ float: 'right' }} href="/" onClick={(e) => {
                    e.preventDefault();
                    sendPhoneVerification();
                }}>{t(translations.profile_page.update_profile.resend)}</a></span>
            </div>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;