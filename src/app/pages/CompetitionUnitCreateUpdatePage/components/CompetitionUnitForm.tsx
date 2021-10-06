import React from 'react';
import { Spin, Form, Divider, DatePicker, Row, Col, TimePicker, Space } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfFormWrapper, SyrfInputField, SyrfTextArea, SyrFieldDescription } from 'app/components/SyrfForm';
import { DeleteButton, GobackButton, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import { create, update, get, cloneCourse, getAllCompetitionUnitsByEventIdWithSort } from 'services/live-data-server/competition-units';
import { get as getEventById } from 'services/live-data-server/event-calendars';
import { BoundingBoxPicker } from './BoundingBoxPicker';
import { toast } from 'react-toastify';
import { CoursesList } from './CoursesList';
import Select from 'rc-select';
import { DeleteCompetitionUnitModal } from 'app/pages/CompetitionUnitListPage/components/DeleteCompetitionUnitModal';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { getVesselParticipantGroupsByEventIdWithSort } from 'services/live-data-server/vessel-participant-group';
import { IoIosArrowBack } from 'react-icons/io';
import { MODE } from 'utils/constants';
import { renderTimezoneInUTCOffset } from 'utils/helpers';

const { getTimeZones } = require("@vvo/tzdb");
const timeZones = getTimeZones();

timeZones.push({
    name: 'Etc/Utc'
});

export const CompetitionUnitForm = () => {

    const history = useHistory();

    const { t } = useTranslation();

    const location = useLocation();

    const [form] = useForm();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { eventId, competitionUnitId } = useParams<{ eventId: string, competitionUnitId: string }>();

    const [boundingBoxCoordinates, setBoundingBoxCoordinates] = React.useState([]);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [competitionUnit, setCompetitionUnit] = React.useState<any>({});

    const [formChanged, setFormChanged] = React.useState<boolean>(false);

    const courseListRef = React.useRef<any>();

    const [groups, setGroups] = React.useState<any[]>([]);

    const [lastCreatedRace, setLastCreatedRace] = React.useState<any>({});

    const onFinish = async (values) => {
        let { name, startDate, startTime, isCompleted, calendarEventId, vesselParticipantGroupId, description, approximateStart_zone } = values;
        let response;
        calendarEventId = eventId || calendarEventId;

        setIsSaving(true);

        const data = {
            name: name,
            startTime: moment(startDate.format("YYYY-MM-DD") + ' ' + startTime.format("HH:mm:ss")).utc(),
            approximateStart: moment(startDate.format("YYYY-MM-DD") + ' ' + startTime.format("HH:mm:ss")).utc(),
            isCompleted: isCompleted,
            vesselParticipantGroupId: vesselParticipantGroupId,
            description: description,
            boundingBox: boundingBoxCoordinates.length > 0 ?
                {
                    "type": "Polygon",
                    "coordinates": [...boundingBoxCoordinates]
                }
                : null,
            calendarEventId: calendarEventId,
            approximateStart_zone: approximateStart_zone
        };

        if (mode === MODE.CREATE)
            response = await create(calendarEventId, data);
        else
            response = await update(calendarEventId, competitionUnitId, data);


        setIsSaving(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                onCompetitionUnitCreated(response);
            } else {
                toast.success(t(translations.competition_unit_create_update_page.successfully_updated_competition_unit, { name: response.data?.name }));
            }

            goBack();
        } else {
            toast.error(t(translations.competition_unit_create_update_page.an_error_happened));
        }
    }

    const onCompetitionUnitCreated = (response) => {
        toast.success(t(translations.competition_unit_create_update_page.created_a_new_competition_unit, { name: response.data?.name }));
        setCompetitionUnit(response.data);
        cloneCourseToTheNewCreatedRace(response.data.id);
    }

    const cloneCourseToTheNewCreatedRace = async (newRaceId) => {
        if (lastCreatedRace) {
            await cloneCourse(lastCreatedRace.id, newRaceId);
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
        } else {
            setDefaultNameForRace();
            setDefaultTimeForRace();
        }
    }

    const setDefaultClassForRace = (vesselGroups) => {
        if (location.pathname.includes(MODE.UPDATE)) return;

        const defaultVesselGroup = vesselGroups[0];

        if (defaultVesselGroup)
            form.setFieldsValue({ vesselParticipantGroupId: defaultVesselGroup.id });
    }

    const getAllUserVesselGroups = async () => {
        const response = await getVesselParticipantGroupsByEventIdWithSort(eventId, 1);

        if (response.success) {
            const vesselGroups = response.data?.rows;
            setGroups(vesselGroups);
            setDefaultClassForRace(vesselGroups);
        }
    }

    const onCoordinatesRecevied = (coordinates) => {
        setBoundingBoxCoordinates(coordinates);
    }

    const renderVesselParticipantGroupList = () => {
        return groups.map((group) => {
            return <Select.Option key={group.id} value={group.id}>{group.name}</Select.Option>
        });
    }

    const onCompetitionUnitDeleted = () => {
        goBack();
    }

    const setDefaultNameForRace = async () => {
        const response = await getAllCompetitionUnitsByEventIdWithSort(eventId, 1);

        if (response.success) {
            form.setFieldsValue({ name: 'R' + ((Number(response.data?.count) + 1) || 1) });
            const races = response.data?.rows;
            if (races.length > 0)
                setLastCreatedRace(races[0]);
        }
    }

    const setDefaultTimeForRace = async () => {
        const response = await getEventById(eventId);

        if (response.success) {
            form.setFieldsValue({ 
                startDate: moment(response.data?.approximateStartTime),
                approximateStart_zone: response.data?.approximateStartTime_zone
            });
        }
    }

    React.useEffect(() => {
        initModeAndData();
        getAllUserVesselGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goBack = () => {
        if (history.action !== 'POP') history.goBack();
        else history.push('/races');
    }

    const renderTimezoneDropdownList = () => {
        return timeZones.map((timezone, index) => {
            return <Select.Option key={index} value={timezone.name}>{timezone.name + ' ' + renderTimezoneInUTCOffset(timezone.name)}</Select.Option>
        });
    }

    return (
        <Wrapper>
            <DeleteCompetitionUnitModal
                competitionUnit={competitionUnit}
                onCompetitionUnitDeleted={onCompetitionUnitDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoOutterWrapper>
                    <GobackButton onClick={() => goBack()}>
                        <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                    </GobackButton>
                    <PageInfoContainer>
                        <PageHeading>{mode === MODE.UPDATE ? t(translations.competition_unit_create_update_page.update_your_competition_unit) : t(translations.competition_unit_create_update_page.create_a_new_competition_unit)}</PageHeading>
                        <PageDescription>{t(translations.competition_unit_create_update_page.race_configurations_pair_classes_to_courses)}</PageDescription>
                    </PageInfoContainer>
                </PageInfoOutterWrapper>
                <Space size={10}>
                    {mode === MODE.UPDATE && <DeleteButton onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.competition_unit_create_update_page.delete)}</DeleteButton>}

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
                        initialValues={{
                            startTime: moment('09:00:00', 'HH:mm:ss'),
                            approximateStart_zone: 'Etc/UTC'
                        }}
                    >
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.name)}</SyrfFieldLabel>}
                            name="name"
                            rules={[{ required: true, max: 255 }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Form.Item
                            rules={[{ max: 255 }]}
                            label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.description)}</SyrfFieldLabel>}
                            name="description"
                        >
                            <SyrfTextArea />
                        </Form.Item>

                        <Divider />

                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
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

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.start_time)}</SyrfFieldLabel>}
                                    name="startTime"
                                    rules={[{ required: true }]}
                                >
                                    <TimePicker className="syrf-datepicker" defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.timezone)}</SyrfFieldLabel>}
                                    name="approximateStart_zone"
                                    rules={[{ required: true }]}
                                >
                                    <SyrfFormSelect placeholder={t(translations.competition_unit_create_update_page.timezone)}
                                        showSearch
                                        filterOption={(input, option) => {
                                            if (option) {
                                                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }

                                            return false;
                                        }}
                                    >
                                        {
                                            renderTimezoneDropdownList()
                                        }
                                    </SyrfFormSelect>
                                </Form.Item>
                            </Col>
                        </Row>

                        <BoundingBoxPicker coordinates={boundingBoxCoordinates} onCoordinatesRecevied={onCoordinatesRecevied} />

                        <Form.Item
                            style={{ marginBottom: '10px' }}
                            label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.vessel_group)}</SyrfFieldLabel>}
                            name="vesselParticipantGroupId"
                            help={<SyrFieldDescription>{t(translations.competition_unit_create_update_page.vessel_participant_group_is_a_set)}</SyrFieldDescription>}
                        >
                            <SyrfFormSelect placeholder={t(translations.competition_unit_create_update_page.select_a_group)}>
                                {renderVesselParticipantGroupList()}
                            </SyrfFormSelect>
                        </Form.Item>
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