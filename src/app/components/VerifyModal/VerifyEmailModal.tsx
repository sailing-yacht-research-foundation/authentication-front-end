import React from 'react';
import { Modal, Form } from 'antd';
import {
    SyrfFieldLabel,
    SyrfInputField,
} from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

interface IVerifyEmailModal {
    showModal: boolean,
    setShowModal: Function,
    sendCode: Function,
    verifyCode: Function
}

export const VerifyEmailModal = (props: IVerifyEmailModal) => {

    const { t } = useTranslation();

    const {
        showModal,
        setShowModal,
        sendCode,
        verifyCode
    } = props;

    const [isVerifying, setIsVerifying] = React.useState<boolean>(false);

    const [verifyForm] = Form.useForm();

    const verifyFormAndVerifyCode = () => {
        verifyForm
            .validateFields()
            .then(async values => {
                const { code } = values;
                setIsVerifying(true);
                verifyCode(code);
                setIsVerifying(false);
                verifyForm.resetFields();
            });
    }

    return (
        <Modal
            title={t(translations.general.please_verify_your_email)}
            visible={showModal}
            confirmLoading={isVerifying}
            onOk={() => {
                verifyFormAndVerifyCode();
            }}
            onCancel={() => {
                setShowModal(false);
            }}>
            <Form
                form={verifyForm}
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
                    sendCode();
                }}>{t(translations.general.resend)}</a></span>
            </div>
        </Modal>
    )
}
