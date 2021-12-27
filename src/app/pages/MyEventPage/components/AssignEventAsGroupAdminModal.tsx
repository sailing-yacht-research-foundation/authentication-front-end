import React from 'react';
import { Modal, Form, Select, Switch, Spin, Tabs } from 'antd';
import { SyrfFieldLabel, SyrfFormButton } from 'app/components/SyrfForm';
import { assignEventAsGroupAdmin, searchGroupForAssigns } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { debounce, showToastMessageOnRequestError } from 'utils/helpers';
import { EventAdminsManager } from './EventAdminsManager';
import { searchForProfiles } from 'services/live-data-server/profile';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getUserAttribute, renderAvatar } from 'utils/user-utils';
import { addEditor } from 'services/live-data-server/event-calendars';
import styled from 'styled-components';

export const AssignEventAsGroupAdminModal = (props) => {

    const { t } = useTranslation();

    const [groupForm] = Form.useForm();

    const [individualForm] = Form.useForm();

    const { showModal, setShowModal, event } = props;

    const [isLoading, setIsLoading] = React.useState(false);

    const [results, setResults] = React.useState<any[]>([]);

    const [people, setPeople] = React.useState<any[]>([]);

    const [checked, setChecked] = React.useState(false);

    const user = useSelector(selectUser);

    const adminsManagerRef = React.useRef<any>();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearch = React.useCallback(debounce((keyword) => onSearch(keyword), 300), []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearchPeople = React.useCallback(debounce((keyword) => onSearchPeople(keyword), 300), []);

    const hideAssignModal = () => {
        setShowModal(false);
        groupForm.setFieldsValue({
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
            showToastMessageOnRequestError(response.error);
        }
    }

    const onSubmitPeople = async (values) => {
        const { personId } = values;
        setIsLoading(true);
        const response = await addEditor(personId, event.id);
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.my_event_create_update_page.successfully_assigned_people_as_editor));
            adminsManagerRef?.current?.getAdmins();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const onSearch = async (keyword) => {
        const response = await searchGroupForAssigns(keyword);

        if (response.success) {
            setResults(response.data.rows);
        }
    }

    const onSearchPeople = async (keyword) => {
        const response = await searchForProfiles(keyword, getUserAttribute(user, 'locale'));

        if (response.success) {
            setPeople(response.data.rows);
        }
    }

    const renderSearchResults = () => {
        return results.map(group => <Select.Option value={group.id}>{group?.groupName}</Select.Option>)
    }

    const renderPeopleResults = () => {
        return people.map(p => <Select.Option value={p.id}><PeopleAvatar src={renderAvatar(p.avatar)}/> {p?.name}</Select.Option>)
    }

    React.useEffect(() => {
        onSearch('');
    }, []);

    return (
        <Modal
            title={t(translations.group.assign_admins_for_this_event)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
            visible={showModal}
            footer={null}
            onCancel={hideAssignModal}
        >
            <Spin spinning={isLoading}>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Group" key="1">
                        <Form
                            form={groupForm}
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
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Individual" key="2">
                        <Form
                            form={individualForm}
                            layout="vertical"
                            name="basic"
                            onFinish={onSubmitPeople}
                            style={{ width: '100%' }}
                        >
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.public_profile.search_or_select_people)}</SyrfFieldLabel>}
                                name="personId"
                                rules={[{ required: true, message: t(translations.public_profile.search_or_select_people) }]}
                            >
                                <SyrfFormSelect
                                    showSearch
                                    allowClear
                                    placeholder={t(translations.public_profile.search_or_select_people)}
                                    optionFilterProp="children"
                                    onSearch={debounceSearchPeople}
                                >
                                    {renderPeopleResults()}
                                </SyrfFormSelect>
                            </Form.Item>

                            <Form.Item>
                                <SyrfFormButton type="primary" htmlType="submit">
                                    {t(translations.assign_vessel_participant_modal.save)}
                                </SyrfFormButton>
                            </Form.Item>
                        </Form>
                    </Tabs.TabPane>
                </Tabs>

            </Spin>

            <EventAdminsManager ref={adminsManagerRef} event={event} />
        </Modal>
    )
}

const PeopleAvatar = styled.img`
    with: 25px;
    height: 25px;
    margin-right: 5px;
    border-radius: 50%;
`;