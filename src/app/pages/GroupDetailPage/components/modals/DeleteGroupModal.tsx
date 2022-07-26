import React from 'react';
import { Modal, Form } from 'antd';
import { SyrfFieldLabel, SyrfInputField } from 'app/components/SyrfForm';
import { toast } from 'react-toastify';
import { deleteGroup } from 'services/live-data-server/groups';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const DeleteGroupModal = (props) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, group } = props;

    const [form] = Form.useForm();

    const history = useHistory();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const checkAndRemoveGroup = () => {
        form
            .validateFields()
            .then(async values => {
                const { groupName } = values;
                if (String(groupName).toLowerCase() !== String(group.groupName).toLowerCase()) {
                    toast.info(t(translations.group.your_entered_group_name_is_not_correct));
                    return;
                }

                setIsLoading(true);
                const response = await deleteGroup(group.id!);
                setIsLoading(false);

                if (response.success) {
                    toast.success(t(translations.group.removed_the_group));
                    history.push('/groups');
                } else {
                    showToastMessageOnRequestError(response.error);
                }
            })
            .catch(info => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    const cancelRemoveGroup = () => {
        setShowModal(false);
    }

    return (
        <Modal
            confirmLoading={isLoading}
            title={t(translations.group.are_you_sure_you_want_to_delete_this_group)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
            onOk={checkAndRemoveGroup}
            onCancel={cancelRemoveGroup}
            visible={showModal}>
            <Form
                form={form}
                layout="vertical"
                name="basic"
                style={{ width: '100%' }}

                initialValues={{
                    groupName: '',
                }}
            >
                <ModalMessage>
                    {t(translations.group.hey_are_you_sure_you_want_to_delete_this_group)}
                </ModalMessage>
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.group.name_of_the_group)}</SyrfFieldLabel>}
                    name="groupName"
                    rules={[{ required: true, message: t(translations.group.group_name_is_required) }]}
                >
                    <SyrfInputField
                        autoCorrect="off"
                        autoComplete="off"
                        autoCapitalize="none"
                        placeholder={t(translations.group.please_input_group_name_to_continue)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;
