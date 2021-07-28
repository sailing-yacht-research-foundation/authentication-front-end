import React from 'react';
import { Modal, Form } from 'antd';
import {
    SyrfFieldLabel,
    SyrfInputNumber,
} from 'app/components/SyrfForm';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import styled from 'styled-components';

export const VerifyPhoneModal = (props) => {

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
            title="Please verify your phone number"
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
                    label={<SyrfFieldLabel>Code</SyrfFieldLabel>}
                    name="code"
                    rules={[{ required: true, type: 'number', min: 6 }]}
                >
                    <SyrfInputNumber />
                </Form.Item>
            </Form>

            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <span> Could not receive the code? &nbsp; <a style={{ float: 'right' }} href="/" onClick={(e) => {
                    e.preventDefault();
                    sendPhoneVerification();
                }}>resend</a></span>
            </div>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;