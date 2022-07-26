import React from 'react';
import { Modal, Form, Select, Spin } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfInputField, SyrfPasswordInputField } from 'app/components/SyrfForm';
import { toast } from 'react-toastify';
import { SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { submitNewCredential } from 'services/live-data-server/external-platform';
import { MODE } from 'utils/constants';

interface ILinkNewCredentialModal {
    showModal: boolean,
    setShowModal: Function,
    reloadParent?: Function,
    credential: any,
    mode: string
}

export const LinkNewCredentialModal = (props: ILinkNewCredentialModal) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const { showModal, setShowModal, reloadParent, credential, mode } = props;

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
                toast.success(t(translations.credentail_manager_page.successfully_linked_this_credential_to_your_account));
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
            title={t(mode === MODE.CREATE ? translations.credentail_manager_page.link_new_credential : translations.credentail_manager_page.edit_credential)}
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
                        source: 'YACHTSCORING',
                        username: credential?.userId || ''
                    }}
                >
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.credentail_manager_page.username)}</SyrfFieldLabel>}
                        name="username"
                        rules={[{ required: true, message: t(translations.credentail_manager_page.username_is_required) }]}
                    >
                        <SyrfInputField autoComplete="off" autoCorrect="off" autoCapitalize="none" />
                    </Form.Item>

                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.credentail_manager_page.password)}</SyrfFieldLabel>}
                        name="password"
                        rules={[{ required: true, message: t(translations.credentail_manager_page.password_is_required) }]}
                    >
                        <SyrfPasswordInputField />
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
                            {t(mode === MODE.CREATE ? translations.credentail_manager_page.link : translations.credentail_manager_page.edit)}
                        </SyrfFormButton>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
