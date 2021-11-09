import React from 'react';
import { Modal, Form } from 'antd';
import { SyrfFieldLabel, SyrfInputField } from 'app/components/SyrfForm';
import { checkIfEmailIsValid } from 'utils/helpers';
import { inviteUsersViaEmails } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export const InviteUserModal = (props) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const { groupId, showModal, setShowModal, onUsersInvited } = props;

    const hideInviteModal = () => {
        setShowModal(false);
        form.setFieldsValue({
            emails: ''
        })
    }

    const inviteUsers = () => {
        form
            .validateFields()
            .then(async values => {
                const { emails } = values;
                const processedEmails = emails.split(',').map(e => {
                    if (checkIfEmailIsValid(e.trim())) {
                        return e.trim();
                    }
                    return null;
                }).filter(Boolean);

                const response = await inviteUsersViaEmails(groupId, processedEmails);

                if (response.success) {
                    toast.success(t(translations.group.invitations_sent));
                    hideInviteModal();
                    onUsersInvited();
                } else {
                    toast.error(t(translations.group.an_error_happened_when_performing_your_request));
                }
            })
            .catch(info => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    return (
        <Modal
            title={t(translations.group.invite_members_via_emails)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
            visible={showModal}
            onOk={inviteUsers}
            onCancel={hideInviteModal}
        >
            <Form
                form={form}
                layout="vertical"
                name="basic"
                style={{ width: '100%' }}
            >
                <Form.Item
                    label={<SyrfFieldLabel>Emails</SyrfFieldLabel>}
                    name="emails"
                    rules={[{ required: true }]}
                >
                    <SyrfInputField
                        autoCorrect="off"
                        placeholder={t(translations.group.please_input_emails_by_using_commas)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}