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
import { showToastMessageOnRequestError } from 'utils/helpers';
import { verifyPhoneNumber } from 'services/live-data-server/user';
import { useDispatch } from 'react-redux';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';

export const VerifyPhoneModal = (props) => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { actions } = UseLoginSlice();

    const {
        showPhoneVerifyModal,
        setShowPhoneVerifyModal,
        sendPhoneVerification,
    } = props;

    const [verifyPhoneForm] = Form.useForm();

    const verifyFormAndPhoneNumber = () => {
        verifyPhoneForm
            .validateFields()
            .then(async values => {
                const { code } = values;
                const response = await verifyPhoneNumber(code);
                if (response.success) {
                    toast.success(t(translations.profile_page.update_profile.your_phone_number_has_been_verified));
                    dispatch(actions.getUser());
                    setShowPhoneVerifyModal(false);
                } else {
                    showToastMessageOnRequestError(response.error);
                }
                verifyPhoneForm.resetFields();
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
                setShowPhoneVerifyModal(false);
            }}>
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
                    rules={[{ required: true, min: 6, message: t(translations.profile_page.update_profile.code_is_required) }]}
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