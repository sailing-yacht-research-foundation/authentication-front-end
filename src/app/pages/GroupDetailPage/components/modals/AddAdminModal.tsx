import React from 'react';
import { Modal, Form, Select } from 'antd';
import { SyrfFieldLabel } from 'app/components/SyrfForm';
import { assignAdmin } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { SyrfFormSelect } from 'app/components/SyrfForm';
import { useParams } from 'react-router';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { debounce, showToastMessageOnRequestError } from 'utils/helpers';
import { GroupMemberStatus } from 'utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectAcceptedMemberResults } from '../../slice/selectors';
import { useGroupDetailSlice } from '../../slice';

interface AddAdminModal {
    showModal: boolean,
    setShowModal: Function,
    onAdminAdded: Function,
    groupId?: string
}

export const AddAdminModal = (props: AddAdminModal) => {

    const { t } = useTranslation();

    const { groupId } = useParams<{ groupId: string }>();

    const [form] = Form.useForm();

    const { showModal, setShowModal, onAdminAdded } = props;

    const { actions } = useGroupDetailSlice();

    const dispatch = useDispatch();

    const results = useSelector(selectAcceptedMemberResults);

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
                    showToastMessageOnRequestError(response.error);
                }
            })
            .catch(info => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    const onSearch = async (keyword: string) => {
        dispatch(actions.searchAcceptedMembers({ groupId, keyword, status: GroupMemberStatus.ACCEPTED }));
    }

    const renderSearchResults = () => {
        return results.map(member => <Select.Option key={member.id} value={member.id}>{member.member?.name} {member.email}</Select.Option>)
    }

    React.useEffect(() => {
        onSearch('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            title={t(translations.group.add_admins)}
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
                    label={<SyrfFieldLabel>{t(translations.group.select_or_search_a_member)}</SyrfFieldLabel>}
                    name="uuid"
                    rules={[{ required: true, message: t(translations.group.please_select_a_member_to_assign_him_as_admin) }]}
                >
                    <SyrfFormSelect
                        showSearch
                        placeholder={t(translations.group.select_or_search_a_member)}
                        optionFilterProp="children"
                        allowClear
                        onSearch={debounceSearch}
                    >
                        {renderSearchResults()}
                    </SyrfFormSelect>
                </Form.Item>
            </Form>
        </Modal>
    )
}
