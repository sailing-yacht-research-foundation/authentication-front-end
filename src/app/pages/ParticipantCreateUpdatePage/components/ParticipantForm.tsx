import React from 'react';
import { Spin, Form, Divider, Space } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormWrapper, SyrfInputField } from 'app/components/SyrfForm';
import { CreateButton, DeleteButton, PageHeaderContainer, PageHeaderText } from 'app/components/SyrfGeneral';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import { create, update, get } from 'services/live-data-server/participants';
import { toast } from 'react-toastify';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { DeleteParticipantModal } from './DeleteParticipantForm';
import { IoIosArrowBack } from 'react-icons/io';

const MODE = {
    UPDATE: 'update',
    CREATE: 'create'
}

export const ParticipantForm = () => {

    const history = useHistory();

    const { t } = useTranslation();

    const location = useLocation();

    const [form] = useForm();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { eventId, id } = useParams<{ eventId: string, id: string }>();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [participant, setParticipant] = React.useState<any>({});

    const [formChanged, setFormChanged] = React.useState<boolean>(false);

    const onFinish = async (values) => {
        let { publicName, participantId, calendarEventId } = values;
        let response;
        calendarEventId = eventId ? eventId : calendarEventId;

        setIsSaving(true);

        const data = {
            publicName: publicName,
            participantId: participantId,
            calendarEventId: calendarEventId,
            userProfileId: null
        };

        if (mode === MODE.CREATE)
            response = await create(data);
        else
            response = await update(id, data);


        setIsSaving(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                toast.success(t(translations.participant_unit_create_update_page.created_a_new_participant, { name: response.data?.name }));
                setParticipant(response.data);
            } else {
                toast.success(t(translations.participant_unit_create_update_page.successfully_updated_participant, { name: response.data?.name }));
            }

            if (eventId) {
                history.push(`/events/${eventId}/update`);
            } else {
                history.push(`/events`);
            }
            setMode(MODE.UPDATE);
        } else {
            toast.error(t(translations.participant_unit_create_update_page.an_error_happened));
        }
    }

    const initModeAndData = async () => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);
            setIsSaving(true);
            const response = await get(id);
            setIsSaving(false);

            if (response.success) {
                setParticipant(response.data);
                form.setFieldsValue({
                    ...response.data,
                });
            } else {
                history.push('/404');
            }
        }
    }

    const onParticipantDeleted = () => {
        history.push(`/events/${participant.calendarEventId}/update`);
    }

    React.useEffect(() => {
        initModeAndData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <DeleteParticipantModal
                participant={participant}
                onParticipantDeleted={onParticipantDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainer style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageHeaderText>{mode === MODE.UPDATE ? t(translations.participant_unit_create_update_page.update_participant) : t(translations.participant_unit_create_update_page.create_a_new_participant)}</PageHeaderText>
                <Space size={10}>
                    <CreateButton onClick={() => {
                        if (eventId) {
                            history.push(`/events/${eventId}/update`);
                        } else {
                            history.push(`/events`);
                        }
                    }} icon={<IoIosArrowBack
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.participant_unit_create_update_page.back_to_race)}</CreateButton>
                    {mode === MODE.UPDATE && <DeleteButton onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.participant_unit_create_update_page.delete)}</DeleteButton>}

                </Space>
            </PageHeaderContainer>
            <SyrfFormWrapper>
                <Spin spinning={isSaving}>
                    <Form
                        layout={'vertical'}
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                        onValuesChange={() => setFormChanged(true)}
                    >
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.participant_unit_create_update_page.public_name)}</SyrfFieldLabel>}
                            name="publicName"
                            rules={[{ required: true }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.participant_unit_create_update_page.participant_id)}</SyrfFieldLabel>}
                            name="participantId"
                            rules={[{ required: true }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Divider />

                        <Form.Item>
                            <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                                {t(translations.participant_unit_create_update_page.save_participant)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>
        </Wrapper >
    )
}


const Wrapper = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;