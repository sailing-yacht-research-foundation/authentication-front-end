import React from 'react';
import { Spin, Form, Divider, DatePicker, Row, Col, TimePicker, Space } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfFormWrapper, SyrfInputField } from 'app/components/SyrfForm';
import { CreateButton, DeleteButton, PageHeaderContainer, PageHeaderText } from 'app/components/SyrfGeneral';
import { BsCardList } from 'react-icons/bs';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import { create, update, get } from 'services/live-data-server/vessels';
import { toast } from 'react-toastify';
import { ParticipantList } from './ParticipantList';
import Select from 'rc-select';
import { getAll } from 'services/live-data-server/event-calendars';
import { DeleteVesselModal } from 'app/pages/VesselListPage/components/DeleteVesselModal';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

const MODE = {
    UPDATE: 'update',
    CREATE: 'create'
}

export const VesselForm = () => {
    const history = useHistory();

    const { t } = useTranslation();

    const location = useLocation();

    const [form] = useForm();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { vesselId } = useParams<{ vesselId: string }>();

    const [races, setRaces] = React.useState<any[]>([]);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [vessel, setVessel] = React.useState<any>({});

    const [formChanged, setFormChanged] = React.useState<boolean>(false);

    const participantRef = React.useRef<any>();

    const onFinish = async (values) => {
        let { publicName, globalId, vesselId, lengthInMeters } = values;
        let response;

        setIsSaving(true);

        const data = {
            publicName: publicName,
            globalId: globalId,
            vesselId: vesselId,
            lengthInMeters: lengthInMeters
        };

        if (mode === MODE.CREATE)
            response = await create(data);
        else
            response = await update(vesselId, data);


        setIsSaving(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                toast.success(t(translations.vessel_create_update_page.created_a_new_vessel, { name: response.data?.publicName }));
                setVessel(response.data);
            } else {
                toast.success(t(translations.vessel_create_update_page.successfully_updated_vessel, { name: response.data?.publicName }));
            }

            history.push(`/vessel/${response.data?.id}/update`);
            setMode(MODE.UPDATE);
            if (participantRef) participantRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else {
            toast.error(t(translations.vessel_create_update_page.an_error_happened));
        }
    }

    const initModeAndData = async () => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);
            setIsSaving(true);
            const response = await get(vesselId);
            setIsSaving(false);

            if (response.success) {
                setVessel(response.data);
                form.setFieldsValue({
                    ...response.data
                });
            } else {
                history.push('/404');
            }
        }
    }
    
    const onVesselDeleted = () => {
        history.push('/vessels');
    }

    React.useEffect(() => {
        initModeAndData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <DeleteVesselModal
                vessel={vessel}
                onVesselDeleted={onVesselDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainer style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageHeaderText>{mode === MODE.UPDATE ? t(translations.vessel_create_update_page.update_your_vessel) : t(translations.vessel_create_update_page.create_a_new_vessel)}</PageHeaderText>
                <Space size={10}>
                    <CreateButton onClick={() => history.push("/my-races")} icon={<BsCardList
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.vessel_create_update_page.view_all_vessels)}</CreateButton>
                    {mode === MODE.UPDATE && <DeleteButton onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.vessel_create_update_page.delete)}</DeleteButton>}

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
                            label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.public_name)}</SyrfFieldLabel>}
                            name="publicName"
                            rules={[{ required: true }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.vessel_id)}</SyrfFieldLabel>}
                            name="vesselId"
                            rules={[{ required: true }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.global_id)}</SyrfFieldLabel>}
                            name="globalId"
                            rules={[{ required: true }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.length_in_meters)}</SyrfFieldLabel>}
                            name="lengthInMeters"
                            rules={[{ type: 'number' }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Divider />

                        <Form.Item>
                            <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                                {t(translations.vessel_create_update_page.save_vessel)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>

            {
                mode === MODE.UPDATE && <SyrfFormWrapper ref={participantRef} style={{ marginTop: '30px' }}>
                    {/* <ParticipantList competitionUnitId={competitionUnitId} /> */}
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