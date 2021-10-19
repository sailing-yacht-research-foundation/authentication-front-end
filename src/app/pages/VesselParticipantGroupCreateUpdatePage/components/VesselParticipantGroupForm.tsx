import React from 'react';
import { Spin, Form, Divider } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormWrapper, SyrfInputField } from 'app/components/SyrfForm';
import { DeleteButton, GobackButton, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import { create, update, getVesselParticipantGroupById } from 'services/live-data-server/vessel-participant-group';
import { toast } from 'react-toastify';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { VesselList } from './VesselList';
import { DeleteVesselParticipantGroupModal } from 'app/pages/VesselParticipantGroupListPage/components/DeleteVesselParticipantGroupModal';
import { IoIosArrowBack } from 'react-icons/io';
import { MODE } from 'utils/constants';
import ReactTooltip from 'react-tooltip';

export const VesselParticipantGroupForm = () => {
    const history = useHistory();

    const { t } = useTranslation();

    const location = useLocation();

    const [form] = useForm();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { id } = useParams<{ id: string }>();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [group, setGroup] = React.useState<any>({});

    const [formChanged, setFormChanged] = React.useState<boolean>(false);

    const { eventId } = useParams<{ eventId: string }>();

    const onFinish = async (values) => {
        let { name } = values;
        let response;

        setIsSaving(true);

        const data = {
            name: name,
            calendarEventId: eventId
        };

        if (mode === MODE.CREATE)
            response = await create(data);
        else
            response = await update(id, data);

        setIsSaving(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                toast.success(t(translations.vessel_participant_group_create_update_page.created_a_new_group));
                setGroup(response.data);
            } else {
                toast.success(t(translations.vessel_participant_group_create_update_page.successfully_updated_group));
            }

            history.push(`/events/${eventId}/classes/${response.data?.id}/update`);
            setMode(MODE.UPDATE);
        } else {
            toast.error(t(translations.vessel_participant_group_create_update_page.an_error_happened));
        }
    }

    const initModeAndData = async () => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);
            setIsSaving(true);
            const response = await getVesselParticipantGroupById(id);
            setIsSaving(false);

            if (response.success) {
                setGroup(response.data);
                form.setFieldsValue({
                    ...response.data
                });
            } else {
                history.push('/404');
            }
        }
    }

    const onGroupDeleted = () => {
        history.push(`/events/${eventId}/update`);
    }

    React.useEffect(() => {
        initModeAndData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <DeleteVesselParticipantGroupModal
                group={group}
                onGroupDeleted={onGroupDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoOutterWrapper>
                    <GobackButton onClick={() => {
                        history.push(`/events/${eventId}/update`);
                    }}>
                        <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                    </GobackButton>
                    <PageInfoContainer>
                        <PageHeading>{mode === MODE.UPDATE ? t(translations.vessel_participant_group_create_update_page.update_group) : t(translations.vessel_participant_group_create_update_page.create_a_new_group)}</PageHeading>
                        <PageDescription>{t(translations.vessel_participant_group_create_update_page.member_of_classes_regattas)}</PageDescription>
                    </PageInfoContainer>
                </PageInfoOutterWrapper>
                {mode === MODE.UPDATE && <>
                    <DeleteButton
                        data-tip={t(translations.tip.delete_class)}
                        onClick={() => setShowDeleteModal(true)}
                        danger
                        icon={<BiTrash
                            style={{ marginRight: '5px' }}
                            size={18} />}>{t(translations.vessel_participant_group_create_update_page.delete)}</DeleteButton>
                    <ReactTooltip />
                </>}
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
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.vessel_participant_group_create_update_page.name)}</SyrfFieldLabel>}
                            name="name"
                            data-tip={t(translations.tip.class_name)}
                            rules={[{ required: true, max: 100 }]}
                        >
                            <SyrfInputField autoCorrect="off" />
                        </Form.Item>

                        <Divider />

                        <Form.Item>
                            <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                                {t(translations.vessel_participant_group_create_update_page.save_group)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>

            {mode === MODE.UPDATE &&
                <SyrfFormWrapper style={{ marginTop: '30px' }}>
                    <VesselList group={group} eventId={eventId} />
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