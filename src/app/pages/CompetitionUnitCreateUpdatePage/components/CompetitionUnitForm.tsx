import React from 'react';
import { Spin, Form, Divider, DatePicker, Row, Col, TimePicker, Space } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfFormWrapper, SyrfInputField, SyrfTextArea, SyrFieldDescription } from 'app/components/SyrfForm';
import { DeleteButton, GobackButton, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import { create, update, get, getAllCompetitionUnitsByEventIdWithSort } from 'services/live-data-server/competition-units';
import { get as getEventById } from 'services/live-data-server/event-calendars';
import { BoundingBoxPicker } from './BoundingBoxPicker';
import { toast } from 'react-toastify';
import Select from 'rc-select';
import { DeleteCompetitionUnitModal } from 'app/pages/CompetitionUnitListPage/components/DeleteCompetitionUnitModal';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { getVesselParticipantGroupsByEventIdWithSort } from 'services/live-data-server/vessel-participant-group';
import { IoIosArrowBack } from 'react-icons/io';
import { MAP_DEFAULT_VALUE, MODE, TIME_FORMAT } from 'utils/constants';
import { renderTimezoneInUTCOffset } from 'utils/helpers';
import { getByEventId } from 'services/live-data-server/courses';
import ReactTooltip from 'react-tooltip';

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

    const [coordinates, setCoordinates] = React.useState(MAP_DEFAULT_VALUE.CENTER);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [competitionUnit, setCompetitionUnit] = React.useState<any>({});

    const [formChanged, setFormChanged] = React.useState<boolean>(true);

    const [groups, setGroups] = React.useState<any[]>([]);

    const [, setLastCreatedRace] = React.useState<any>({});

    const [courses, setCourses] = React.useState<any[]>([]);

    const onFinish = async (values) => {
        let { name, startDate, startTime, isCompleted, calendarEventId, vesselParticipantGroupId, description, approximateStart_zone, courseId } = values;
        let response;
        calendarEventId = eventId || calendarEventId;

        setIsSaving(true);

        const data = {
            name: name,
            startTime: moment(startDate.format(TIME_FORMAT.number) + ' ' + startTime.format("HH:mm:ss")).utc(),
            approximateStart: moment(startDate.format(TIME_FORMAT.number) + ' ' + startTime.format("HH:mm:ss")).utc(),
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
            approximateStart_zone: approximateStart_zone,
            courseId: courseId,
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
    }

    const initModeAndData = async () => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setFormChanged(false);
            setMode(MODE.UPDATE);
            setIsSaving(true);
            const response = await get(eventId, competitionUnitId);
            setIsSaving(false);

            if (response.success) {
                setCompetitionUnit(response.data);
                form.setFieldsValue({
                    ...response.data,
                    startDate: moment(response.data?.approximateStart),
                    startTime: moment(response.data?.approximateStart)
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
        setFormChanged(true);
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

    const initUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                setCoordinates({
                    lat: coords.latitude,
                    lng: coords.longitude
                });
            });
        }
    }

    React.useEffect(() => {
        initUserLocation();
        initModeAndData();
        getAllUserVesselGroups();
        getAllEventCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllEventCourses = async () => {
        const response = await getByEventId(eventId, {
            page: 1,
            size: 100
        });

        if (response.success) {
            const courses = response.data?.rows;
            setCourses(courses);
        }
    }

    const goBack = () => {
        if (history.action !== 'POP') history.goBack();
        else history.push('/races');
    }

    const renderCourseDropdownList = () => {
        return courses.map((course) => {
            return <Select.Option key={course.id} value={course.id}>{course.name}</Select.Option>
        });
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
                    {mode === MODE.UPDATE &&
                        <>
                            <DeleteButton
                                data-tip={t(translations.tip.delete_race)}
                                onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                                    style={{ marginRight: '5px' }}
                                    size={18}
                                />}>{t(translations.competition_unit_create_update_page.delete)}</DeleteButton>
                            <ReactTooltip/>
                        </>}
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
                            data-tip={t(translations.tip.race_name)}
                            rules={[{ required: true, message: t(translations.forms.race_name_is_required) }, {
                                max: 150, message: t(translations.forms.race_name_must_not_be_longer_than_150_chars)
                            }]}
                        >
                            <SyrfInputField autoCorrect="off" />
                        </Form.Item>

                        <Form.Item
                            rules={[{ max: 255, message: t(translations.forms.race_description_must_not_be_longer_than_255_chars) }]}
                            data-tip={t(translations.tip.race_description)}
                            label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.description)}</SyrfFieldLabel>}
                            name="description"
                        >
                            <SyrfTextArea autoCorrect="off" />
                        </Form.Item>

                        <Divider />

                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    data-tip={t(translations.tip.race_start_date)}
                                    label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.start_date)}</SyrfFieldLabel>}
                                    name="startDate"
                                    rules={[{ type: 'date' }, {
                                        required: true,
                                        message: t(translations.forms.start_date_is_required)
                                    }]}
                                >
                                    <DatePicker
                                        showToday={true}
                                        className="syrf-datepicker"
                                        data-tip={t(translations.tip.race_start_time)}
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
                                    data-tip={t(translations.tip.race_start_time)}
                                    label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.start_time)}</SyrfFieldLabel>}
                                    name="startTime"
                                    rules={[{ required: true, message: t(translations.forms.start_time_is_required) }]}
                                >
                                    <TimePicker className="syrf-datepicker" defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    data-tip={t(translations.tip.race_start_timezone)}
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

                        <BoundingBoxPicker userCoordinates={coordinates} coordinates={boundingBoxCoordinates} onCoordinatesRecevied={onCoordinatesRecevied} />

                        <Form.Item
                            data-tip={t(translations.tip.race_class)}
                            style={{ marginBottom: '10px' }}
                            label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.vessel_group)}</SyrfFieldLabel>}
                            name="vesselParticipantGroupId"
                            help={<SyrFieldDescription>{t(translations.competition_unit_create_update_page.vessel_participant_group_is_a_set)}</SyrFieldDescription>}
                        >
                            <SyrfFormSelect placeholder={t(translations.competition_unit_create_update_page.select_a_group)}>
                                {renderVesselParticipantGroupList()}
                            </SyrfFormSelect>
                        </Form.Item>

                        <Form.Item
                            style={{ marginBottom: '10px' }}
                            label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.course)}</SyrfFieldLabel>}
                            name="courseId"
                            help={<SyrFieldDescription>{t(translations.competition_unit_create_update_page.course_is_a_set)}</SyrFieldDescription>}
                        >
                            <SyrfFormSelect placeholder={t(translations.competition_unit_create_update_page.select_a_course)}>
                                {renderCourseDropdownList()}
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
            <ReactTooltip />
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