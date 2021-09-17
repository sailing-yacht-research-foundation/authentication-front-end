import React from 'react';
import { Spin, Form, Divider, DatePicker, Switch, Row, Col, TimePicker, Space } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfFormWrapper, SyrfInputField } from 'app/components/SyrfForm';
import { CreateButton, DeleteButton, PageHeaderContainer, PageHeaderText } from 'app/components/SyrfGeneral';
import { BsCardList } from 'react-icons/bs';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import { create, update, get } from 'services/live-data-server/competition-units';
import { BoundingBoxPicker } from './BoundingBoxPicker';
import { toast } from 'react-toastify';
import { CoursesList } from './CoursesList';
import Select from 'rc-select';
import { getAll } from 'services/live-data-server/event-calendars';
import { DeleteCompetitionUnitModal } from 'app/pages/CompetitionUnitListPage/components/DeleteCompetitionUnitModal';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

const MODE = {
    UPDATE: 'update',
    CREATE: 'create'
}

export const CompetitionUnitForm = () => {
    const history = useHistory();

    const { t } = useTranslation();

    const location = useLocation();

    const [form] = useForm();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { eventId, competitionUnitId } = useParams<{ eventId: string, competitionUnitId: string }>();

    const [boundingBoxCoordinates, setBoundingBoxCoordinates] = React.useState([]);

    const [races, setRaces] = React.useState<any[]>([]);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [competitionUnit, setCompetitionUnit] = React.useState<any>({});

    const [formChanged, setFormChanged] = React.useState<boolean>(false);

    const courseListRef = React.useRef<any>();

    const onFinish = async (values) => {
        let { name, startDate, startTime, isCompleted, calendarEventId } = values;
        let response;
        calendarEventId = eventId ? eventId : calendarEventId;

        setIsSaving(true);

        const data = {
            name: name,
            startTime: moment(startDate.format("YYYY-MM-DD") + ' ' + startTime.format("HH:mm:ss")).utc(),
            approximateStart: moment(startDate.format("YYYY-MM-DD") + ' ' + startTime.format("HH:mm:ss")).utc(),
            isCompleted: isCompleted,
            boundingBox: boundingBoxCoordinates.length > 0 ?
                {
                    "type": "Polygon",
                    "coordinates": [...boundingBoxCoordinates]
                }
                : null,
            calendarEventId: calendarEventId
        };

        if (mode === MODE.CREATE)
            response = await create(calendarEventId, data);
        else
            response = await update(calendarEventId, competitionUnitId, data);


        setIsSaving(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                toast.success(t(translations.competition_unit_create_update_page.created_a_new_competition_unit, { name: response.data?.name }));
                setCompetitionUnit(response.data);
            } else {
                toast.success(t(translations.competition_unit_create_update_page.successfully_updated_competition_unit, { name: response.data?.name }));
            }

            history.push(`/my-events/${calendarEventId}/my-races/${response.data?.id}/update`);
            setMode(MODE.UPDATE);
            if (courseListRef) courseListRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else {
            toast.error(t(translations.competition_unit_create_update_page.an_error_happened));
        }
    }

    const initModeAndData = async () => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);
            setIsSaving(true);
            const response = await get(eventId, competitionUnitId);
            setIsSaving(false);

            if (response.success) {
                setCompetitionUnit(response.data);
                form.setFieldsValue({
                    ...response.data,
                    startDate: moment(response.data?.approximateStartTime),
                    startTime: moment(response.data?.approximateStartTime)
                });
                if (response.data?.boundingBox?.coordinates)
                    setBoundingBoxCoordinates(response.data?.boundingBox?.coordinates);
            } else {
                history.push('/404');
            }
        }
    }

    const getAllRaces = async () => {
        const response = await getAll();

        if (response.success) {
            setRaces(response.data.rows);
        }
    }

    const onCoordinatesRecevied = (coordinates) => {
        setBoundingBoxCoordinates(coordinates);
    }

    const renderRacesDropdownList = () => {
        return races.map((race) => {
            return <Select.Option key={race.id} value={race.id}>{race.name}</Select.Option>
        });
    }

    const onCompetitionUnitDeleted = () => {
        history.push('/my-races');
    }

    React.useEffect(() => {
        initModeAndData();
        getAllRaces();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <DeleteCompetitionUnitModal
                competitionUnit={competitionUnit}
                onCompetitionUnitDeleted={onCompetitionUnitDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainer style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageHeaderText>{mode === MODE.UPDATE ? t(translations.competition_unit_create_update_page.update_your_competition_unit) : t(translations.competition_unit_create_update_page.create_a_new_competition_unit)}</PageHeaderText>
                <Space size={10}>
                    <CreateButton onClick={() => history.push("/my-races")} icon={<BsCardList
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.competition_unit_create_update_page.view_all_competition_units)}</CreateButton>
                    {mode === MODE.UPDATE && <DeleteButton onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.competition_unit_create_update_page.delete)}</DeleteButton>}

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
                            label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.name)}</SyrfFieldLabel>}
                            name="name"
                            rules={[{ required: true }]}
                        >
                            <SyrfInputField />
                        </Form.Item>
                        {
                            !eventId && <Form.Item
                                label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.event_id)}</SyrfFieldLabel>}
                                name="calendarEventId"
                                rules={[{ required: true }]}
                            >
                                <SyrfFormSelect placeholder={t(translations.competition_unit_create_update_page.select_an_event)}
                                    showSearch
                                    filterOption={(input, option) => {
                                        if (option) {
                                            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }

                                        return false;
                                    }}
                                >
                                    {renderRacesDropdownList()}
                                </SyrfFormSelect>
                            </Form.Item>
                        }

                        <Divider />

                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.start_date)}</SyrfFieldLabel>}
                                    name="startDate"
                                    rules={[{ type: 'date', required: true }]}
                                >
                                    <DatePicker
                                        showToday={true}
                                        className="syrf-datepicker"
                                        style={{ width: '100%' }}
                                        dateRender={current => {
                                            return (
                                                <div className="ant-picker-cell-inner">
                                                    {current.date()}
                                                </div>
                                            );
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.start_time)}</SyrfFieldLabel>}
                                    name="startTime"
                                    rules={[{ required: true }]}
                                >
                                    <TimePicker className="syrf-datepicker" defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <BoundingBoxPicker coordinates={boundingBoxCoordinates} onCoordinatesRecevied={onCoordinatesRecevied} />

                        <Form.Item>
                            <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                                {t(translations.competition_unit_create_update_page.save_competition_unit)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>

            {
                mode === MODE.UPDATE && <SyrfFormWrapper ref={courseListRef} style={{ marginTop: '30px' }}>
                    <CoursesList competitionUnitId={competitionUnitId} />
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