import React from 'react';
import { Modal, Form } from 'antd';
import {
    SyrfFieldLabel,
    SyrfInputField,
} from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export const VerifyPhoneModal = (props) => {

    const { t } = useTranslation();

    const {
        showPhoneVerifyModal,
        setShowPhoneVerifyModal,
        sendPhoneVerification,
        verifyPhone
    } = props;

    const [verifyPhoneForm] = Form.useForm();

    const verifyFormAndPhoneNumber = () => {
        verifyPhoneForm
            .validateFields()
            .then(async values => {
                const { code } = values;
                verifyPhone(code);
                verifyPhoneForm.resetFields();
            });
    }

    return (
        <Modal
            title={t(translations.general.please_verify_your_phone_number)}
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
                    label={<SyrfFieldLabel>{t(translations.general.code)}</SyrfFieldLabel>}
                    name="code"
                    rules={[{ required: true, min: 6, message: t(translations.general.code_is_required) }]}
                >
                    <SyrfInputField
                        placeholder={t(translations.general.enter_the_code_you_received)}
                        type="number"
                    />
                </Form.Item>
            </Form>

            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <span>{t(translations.general.could_not_receive_the_code)} &nbsp; <a style={{ float: 'right' }} href="/" onClick={(e) => {
                    e.preventDefault();
                    sendPhoneVerification();
                }}>{t(translations.general.resend)}</a></span>
            </div>
        </Modal>
    )
}