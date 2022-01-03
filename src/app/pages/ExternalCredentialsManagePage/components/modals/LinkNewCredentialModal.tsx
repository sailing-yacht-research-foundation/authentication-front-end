import React from 'react';
import { Modal, Form, Select, Spin } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfInputField } from 'app/components/SyrfForm';
import { toast } from 'react-toastify';
import { SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { submitNewCredential } from 'services/live-data-server/external-platform';

export const LinkNewCredentialModal = (props) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const { showModal, setShowModal, reloadParent } = props;

    const [isLoading, setIsLoading] = React.useState(false);

    const hideModal = () => {
        setShowModal(false);
        form.resetFields();
    }

    const onFinish = async (values) => {
        const { username, password, source } = values;
        setIsLoading(true);
        const response = await submitNewCredential({ user: username, password }, source);
        setIsLoading(false);

        if (response.success) {
            if (response.data?.isSuccess) {
                toast.success(t(translations.credentail_manager_page.successfully_linked_new_credential_to_your_account));
                hideModal();
            } else {
                toast.info(t(translations.credentail_manager_page.there_is_something_wrong_with_your_credential));
            }
            if (reloadParent && typeof reloadParent === 'function') reloadParent();
        } else {
            showToastMessageOnRequestError(response.error);
            hideModal();
        }
    }

    const renderSourcesList = () => {
        return ['YACHTSCORING'].map((source, index) => {
            return <Select.Option key={index} value={source}>{source}</Select.Option>
        });
    }

    return (
        <Modal
            title={t(translations.credentail_manager_page.link_new_credential)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
            visible={showModal}
            footer={null}
            onCancel={hideModal}
        >
            <Spin spinning={isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    style={{ width: '100%' }}
                    initialValues={{
                      source: 'YACHTSCORING'  
                    }}
                >
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.credentail_manager_page.username)}</SyrfFieldLabel>}
                        name="username"
                        rules={[{ required: true, message: t(translations.credentail_manager_page.username_is_required) }]}
                    >
                        <SyrfInputField />
                    </Form.Item>

                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.credentail_manager_page.password)}</SyrfFieldLabel>}
                        name="password"
                        rules={[{ required: true, message: t(translations.credentail_manager_page.password_is_required) }]}
                    >
                        <SyrfInputField />
                    </Form.Item>

                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.credentail_manager_page.source)}</SyrfFieldLabel>}
                        name="source"
                        rules={[{ required: true, message: t(translations.credentail_manager_page.source) }]}
                    >
                        <SyrfFormSelect>
                            {renderSourcesList()}
                        </SyrfFormSelect>
                    </Form.Item>

                    <Form.Item>
                        <SyrfFormButton type="primary" htmlType="submit">
                            {t(translations.credentail_manager_page.link)}
                        </SyrfFormButton>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}