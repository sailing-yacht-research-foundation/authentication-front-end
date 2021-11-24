import React from 'react';
import { Modal, Form, Select } from 'antd';
import { SyrfFieldLabel } from 'app/components/SyrfForm';
import { assignAdmin, searchMembers } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { SyrfFormSelect } from 'app/components/SyrfForm';
import { useParams } from 'react-router';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { debounce } from 'utils/helpers';

export const AddAdminModal = (props) => {

    const { t } = useTranslation();

    const { groupId } = useParams<{ groupId: string }>();

    const [form] = Form.useForm();

    const { showModal, setShowModal, onAdminAdded } = props;

    const [results, setResults] = React.useState<any[]>([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearch = React.useCallback(debounce((keyword) => onSearch(keyword), 300), []);

    const hideAddAdminModal = () => {
        setShowModal(false);
        form.setFieldsValue({
            uuid: ''
        })
    }

    const setUserAsAdmin = () => {
        form
            .validateFields()
            .then(async values => {
                const { uuid } = values;
                const response = await assignAdmin(groupId, uuid);

                if (response.success) {
                    toast.success(t(translations.group.successfully_set_user_as_admin));
                    hideAddAdminModal();
                    onAdminAdded();
                } else {
                    toast.error(t(translations.group.an_error_happened_when_performing_your_request));
                }
            })
            .catch(info => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    const onSearch = async (keyword) => {
        const response = await searchMembers(groupId, keyword);

        if (response.success) {
            setResults(response.data.rows);
        }
    }

    const renderSearchResults = () => {
        return results.map(member => <Select.Option value={member.id}>{member.member?.name + ' - ' + member.email}</Select.Option>)
    }

    return (
        <Modal
            title={t(translations.group.assign_new_admin)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
            visible={showModal}
            onOk={setUserAsAdmin}
            onCancel={hideAddAdminModal}
        >
            <Form
                form={form}
                layout="vertical"
                name="basic"
                style={{ width: '100%' }}
            >
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.group.select_a_member)}</SyrfFieldLabel>}
                    name="uuid"
                    rules={[{ required: true, message: t(translations.group.please_select_a_member_to_assign_him_as_admin) }]}
                >
                    <SyrfFormSelect
                        showSearch
                        placeholder={t(translations.group.select_a_member)}
                        optionFilterProp="children"
                        onSearch={debounceSearch}
                    >
                        {renderSearchResults()}
                    </SyrfFormSelect>
                </Form.Item>
            </Form>
        </Modal>
    )
}
