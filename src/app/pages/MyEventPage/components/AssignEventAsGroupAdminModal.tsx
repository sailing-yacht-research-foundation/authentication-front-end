import React from 'react';
import { Modal, Form, Select, Switch } from 'antd';
import { SyrfFieldLabel } from 'app/components/SyrfForm';
import { assignEventAsGroupAdmin, searchMyGroups } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { debounce } from 'utils/helpers';

export const AssignEventAsGroupAdminModal = (props) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const { showModal, setShowModal, event } = props;

    const [results, setResults] = React.useState<any[]>([]);

    const [checked, setChecked] = React.useState(false);

    const debounceSearch = React.useCallback(debounce((keyword) => onSearch(keyword), 300), []);

    const hideAssignModal = () => {
        setShowModal(false);
        form.setFieldsValue({
            groupId: ''
        });
        setChecked(false);
    }

    const handleChecked = (checked) => {
        setChecked(checked);
    }

    const assignCalendarEventAsGroupAdmin = () => {
        form
            .validateFields()
            .then(async values => {
                const { groupId } = values;
                const response = await assignEventAsGroupAdmin(groupId, event.id, checked);

                if (response.success) {
                    toast.success(t(translations.group.successfully_added_this_event_as_group_admin));
                } else {
                    toast.error(t(translations.group.an_error_happened_when_performing_your_request));
                }
                hideAssignModal();
            })
            .catch(info => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    const onSearch = async (keyword) => {
        const response = await searchMyGroups(keyword);

        if (response.success) {
            setResults(response.data.rows);
        }
    }

    const renderSearchResults = () => {
        return results.map(group => <Select.Option value={group?.group?.id}>{group?.group?.groupName}</Select.Option>)
    }

    return (
        <Modal
            title={t(translations.group.assign_this_event_as_group_admin)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
            visible={showModal}
            onOk={assignCalendarEventAsGroupAdmin}
            onCancel={hideAssignModal}
        >
            <Form
                form={form}
                layout="vertical"
                name="basic"
                style={{ width: '100%' }}
            >
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.group.select_a_group)}</SyrfFieldLabel>}
                    name="groupId"
                    rules={[{ required: true, message: t(translations.group.please_choose_a_group) }]}
                >
                    <SyrfFormSelect
                        showSearch
                        placeholder={t(translations.group.select_a_group)}
                        optionFilterProp="children"
                        onSearch={debounceSearch}
                    >
                        {renderSearchResults()}
                    </SyrfFormSelect>
                </Form.Item>

                <Form.Item label={<SyrfFieldLabel>{t(translations.group.invididual_assignment_only)}</SyrfFieldLabel>} name="isIndividualAssignment" valuePropName="checked"><Switch checked={checked} onChange={handleChecked} checkedChildren="Yes" unCheckedChildren="No" /> </Form.Item>
            </Form>
        </Modal>
    )
}
