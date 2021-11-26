import React from 'react';
import { Modal, Form, Select, Switch, Spin } from 'antd';
import { SyrfFieldLabel, SyrfFormButton } from 'app/components/SyrfForm';
import { assignEventAsGroupAdmin, searchGroupForAssigns } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { debounce } from 'utils/helpers';
import { EventAdminsManager } from './EventAdminsManager';

export const AssignEventAsGroupAdminModal = (props) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const { showModal, setShowModal, event } = props;

    const [isLoading, setIsLoading] = React.useState(false);

    const [results, setResults] = React.useState<any[]>([]);

    const [checked, setChecked] = React.useState(false);

    const adminsManagerRef = React.useRef<any>();

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const onFinish = async (values) => {
        const { groupId } = values;
        setIsLoading(true);
        const response = await assignEventAsGroupAdmin(groupId, event.id, checked);
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.group.successfully_added_this_event_as_group_admin));
            adminsManagerRef?.current?.getAdmins();
        } else {
            toast.error(t(translations.group.an_error_happened_when_performing_your_request));
        }
    }

    const onSearch = async (keyword) => {
        const response = await searchGroupForAssigns(keyword);

        if (response.success) {
            setResults(response.data.rows);
        }
    }

    const renderSearchResults = () => {
        return results.map(group => <Select.Option value={group.id}>{group?.groupName}</Select.Option>)
    }

    React.useEffect(() => {
        onSearch('');
    }, []);

    return (
        <Modal
            title={t(translations.group.assign_this_event_as_group_admin)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
            visible={showModal}
            footer={null}
            onCancel={hideAssignModal}
        >
            <Spin spinning={isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.group.select_or_search_a_group)}</SyrfFieldLabel>}
                        name="groupId"
                        rules={[{ required: true, message: t(translations.group.please_choose_a_group) }]}
                    >
                        <SyrfFormSelect
                            showSearch
                            allowClear
                            placeholder={t(translations.group.select_or_search_a_group)}
                            optionFilterProp="children"
                            onSearch={debounceSearch}
                        >
                            {renderSearchResults()}
                        </SyrfFormSelect>
                    </Form.Item>

                    <Form.Item label={<SyrfFieldLabel>{t(translations.group.add_current_group_members)}</SyrfFieldLabel>} name="isIndividualAssignment" valuePropName="checked"><Switch checked={checked} onChange={handleChecked} checkedChildren="Yes" unCheckedChildren="No" /> </Form.Item>
                    <Form.Item>
                        <SyrfFormButton type="primary" htmlType="submit">
                            {t(translations.assign_vessel_participant_modal.save)}
                        </SyrfFormButton>
                    </Form.Item>
                </Form>
            </Spin>

            <EventAdminsManager ref={adminsManagerRef} event={event} />
        </Modal>
    )
}
