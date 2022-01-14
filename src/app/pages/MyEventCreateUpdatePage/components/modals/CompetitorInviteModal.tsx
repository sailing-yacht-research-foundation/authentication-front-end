import React from 'react';
import { Modal, Spin, Button, Select, Form } from 'antd';
import { toast } from 'react-toastify';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { debounce, showToastMessageOnRequestError } from 'utils/helpers';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getUserAttribute, renderAvatar } from 'utils/user-utils';
import styled from 'styled-components';
import { searchForProfiles } from 'services/live-data-server/profile';
import { Link } from 'react-router-dom';
import { getAllByCalendarEventId, inviteCompetitor, inviteGroupsAsCompetitors } from 'services/live-data-server/participants';
import { AdminType, CompetitorType } from 'utils/constants';
import { searchGroupForAssigns } from 'services/live-data-server/groups';
import { SyrfFormButton, SyrfFormSelect } from 'app/components/SyrfForm';

export const CompetitorInviteModal = (props) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, eventId } = props;

    const [isLoading, setIsLoading] = React.useState(false);

    const [items, setItems] = React.useState<any[]>([]);

    const participants = React.useRef<any[]>([]);

    const user = useSelector(selectUser);

    const [form] = Form.useForm();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearch = React.useCallback(debounce((keyword) => onSearch(keyword), 300), []);

    const hideAssignModal = () => {
        setShowModal(false);
    }

    const onSearch = async (keyword) => {
        setItems([]);

        getAllParticipants();

        const groupResponse = await searchGroupForAssigns(keyword);
        const peopleResponse = await searchForProfiles(keyword, getUserAttribute(user, 'locale'));
        let groupRows = [];
        let peopleRows = [];

        if (groupResponse.success) {
            groupRows = groupResponse.data.rows.map(group => {
                return {
                    type: AdminType.GROUP,
                    id: group.id,
                    avatar: group.groupImage,
                    name: group.groupName,
                }
            });
        }

        if (peopleResponse.success) {
            peopleRows = peopleResponse.data.rows.filter(p => !participants.current.includes(p.id)).map(p => {
                return {
                    type: AdminType.INDIVIDUAL,
                    id: p.id,
                    avatar: p.avatar,
                    name: p.name,
                }
            })
        }

        setItems([...groupRows, ...peopleRows]);
    }

    const getAllParticipants = async () => {
        const response = await getAllByCalendarEventId(eventId, 1, 100);

        if (response.success) {
            participants.current = response.data?.rows?.map(participant => participant.userProfileId).filter(Boolean);
        }
    }

    const renderItemResults = () => {
        return items.map(item => <Select.Option style={{ padding: '5px' }} value={JSON.stringify(item)}>
            <ItemAvatar src={renderAvatar(item.avatar)} /> {item.name}, type: {item.type}
        </Select.Option>)
    }

    const onFinish = async (values) => {
        const { competitors } = values;
        const parsedCompetitors = competitors ? competitors.map(item => JSON.parse(item)) : [];

        const individuals = parsedCompetitors.filter(item => item.type === CompetitorType.INDIVIDUAL).map(item => ({
            publicName: item.name,
            userProfileId: item.id,
            calendarEventId: eventId,
            trackerUrl: false
        }));

        const groups = parsedCompetitors.filter(item => item.type === CompetitorType.GROUP).map(item => item.id);

        setIsLoading(true);

        const individualResponse = await inviteCompetitor(individuals);
        const groupResponse = await inviteGroupsAsCompetitors(groups, eventId);

        if (individualResponse.success) {
            toast.success(t(translations.my_event_create_update_page.successfully_invited_your_participants, { numberOfCompetitors: individuals.length }))
        } else {
            showToastMessageOnRequestError(individualResponse.error);
        }

        if (groupResponse.success) {
            toast.success(t(translations.my_event_create_update_page.successfully_invited_your_participants_from_group, { numberOfCompetitors: groupResponse.data?.invited, numberOfGroups: groups.length }))
        } else {
            showToastMessageOnRequestError(individualResponse.error);
        }

        setIsLoading(false);
        setShowModal(false);
        form.resetFields();
    }

    return (
        <Modal
            title={t(translations.my_event_create_update_page.invite_competitors)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
            visible={showModal}
            footer={null}
            onCancel={hideAssignModal}
        >
            <Spin spinning={isLoading}>
                <Form onFinish={onFinish} form={form}>
                    <Form.Item
                        name="competitors"
                        rules={[{ required: true, message: t(translations.forms.competitors_are_required) }]}
                        data-tip={t(translations.my_event_create_update_page.invite_groups_or_individual_by_searching_them)}>
                        <SyrfFormSelect mode="multiple"
                            style={{ width: '100%' }}
                            placeholder={t(translations.my_event_create_update_page.invite_groups_or_individual_by_searching_them)}
                            onSearch={debounceSearch}
                            filterOption={false}
                            allowClear
                            maxTagCount={'responsive' as const}
                        >
                            {renderItemResults()}
                        </SyrfFormSelect>
                    </Form.Item>

                    <Form.Item>
                        <SyrfFormButton type="primary" htmlType="submit">
                            {t(translations.my_event_create_update_page.invite_competitors)}
                        </SyrfFormButton>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}

const ItemAvatar = styled.img`
    with: 25px;
    height: 25px;
    margin-right: 5px;
    border-radius: 50%;
`;