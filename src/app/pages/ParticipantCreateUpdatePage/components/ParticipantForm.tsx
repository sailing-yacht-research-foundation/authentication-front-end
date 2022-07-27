import React from 'react';
import { Spin, Form, Divider, Space, Tooltip } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormWrapper, SyrfInputField } from 'app/components/SyrfForm';
import { DeleteButton, GobackButton, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
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
import { MODE } from 'utils/constants';
import { VesselParticipantList } from './VesselParticipantList';
import { showToastMessageOnRequestError } from 'utils/helpers';

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
        let { publicName, calendarEventId } = values;
        let response;
        calendarEventId = eventId || calendarEventId;

        setIsSaving(true);

        const data = {
            publicName: publicName,
            calendarEventId: calendarEventId,
            participantId: '',
            userProfileId: null
        };

        if (mode === MODE.CREATE)
            response = await create(data);
        else
            response = await update(id, data);


        setIsSaving(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                toast.success(t(translations.participant_unit_create_update_page.created_a_new_participant, { name: response.data?.publicName }));
                setParticipant(response.data);
            } else {
                toast.success(t(translations.participant_unit_create_update_page.successfully_updated_participant, { name: response.data?.publicName }));
            }

            if (eventId) {
                history.push(`/events/${eventId}/update`);
            } else {
                history.push(`/events`);
            }
            setMode(MODE.UPDATE);
        } else {
            showToastMessageOnRequestError(response.error);
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
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoOutterWrapper>
                    <GobackButton onClick={() => {
                        if (eventId) {
                            history.push(`/events/${eventId}/update`);
                        } else {
                            history.push(`/events`);
                        }
                    }}>
                        <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                    </GobackButton>
                    <PageInfoContainer>
                        <PageHeading>{mode === MODE.UPDATE ? t(translations.participant_unit_create_update_page.update_participant) : t(translations.participant_unit_create_update_page.create_a_new_participant)}</PageHeading>
                        <PageDescription>{t(translations.participant_unit_create_update_page.participants_are_human_sailors)}</PageDescription>
                    </PageInfoContainer>
                </PageInfoOutterWrapper>
                <Space size={10}>
                    {mode === MODE.UPDATE && <Tooltip title={t(translations.tip.delete_competitor)}>
                        <DeleteButton
                            onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                                style={{ marginRight: '5px' }}
                                size={18} />}>{t(translations.general.delete)}</DeleteButton>
                    </Tooltip>}

                </Space>
            </PageHeaderContainerResponsive>
            <SyrfFormWrapper>
                <Spin spinning={isSaving}>
                    <Form
                        layout={'vertical'}
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                        onValuesChange={() => setFormChanged(true)}
                    >
                        <Tooltip title={t(translations.tip.competitor_name)}>
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.general.public_name)}</SyrfFieldLabel>}
                                name="publicName"
                                rules={[
                                    { required: true, message: t(translations.forms.competitor_name_is_required) },
                                    { max: 50, message: t(translations.forms.competitor_name_must_not_longer_than_50_character) }
                                ]}
                            >
                                <SyrfInputField  />
                            </Form.Item>
                        </Tooltip>

                        <Divider />

                        <Form.Item>
                            <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                                {t(translations.participant_unit_create_update_page.save_participant)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>

            {
                mode === MODE.UPDATE && <SyrfFormWrapper style={{ marginTop: '30px' }}>
                    <VesselParticipantList participant={participant} eventId={eventId} />
                </SyrfFormWrapper>
            }
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
