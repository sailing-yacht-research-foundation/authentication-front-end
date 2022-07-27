import React from 'react';
import { Spin, Form, Divider, DatePicker, Row, Col, TimePicker, Space, message, Tooltip } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfFormWrapper, SyrfInputField, SyrfTextArea, SyrFieldDescription } from 'app/components/SyrfForm';
import { DeleteButton, GobackButton, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import { create, update, get, getAllCompetitionUnitsByEventIdWithSort, getAllByCalendarEventId } from 'services/live-data-server/competition-units';
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
import { EventState, MAP_DEFAULT_VALUE, MODE, RaceStatus, TIME_FORMAT } from 'utils/constants';
import { renderTimezoneInUTCOffset, showToastMessageOnRequestError } from 'utils/helpers';
import { getByEventId } from 'services/live-data-server/courses';
import { CalendarEvent } from 'types/CalendarEvent';
import { VesselParticipantGroup } from 'types/VesselParticipantGroup';
import { CompetitionUnit } from 'types/CompetitionUnit';
import { Course } from 'types/Course';

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

    const [competitionUnit, setCompetitionUnit] = React.useState<Partial<CompetitionUnit>>({});

    const [formChanged, setFormChanged] = React.useState<boolean>(true);

    const [eventData, setEventData] = React.useState<Partial<CalendarEvent>>({});

    const [groups, setGroups] = React.useState<VesselParticipantGroup[]>([]);

    const [, setLastCreatedRace] = React.useState<Partial<CompetitionUnit>>({});

    const [courses, setCourses] = React.useState<Course[]>([]);

    const [error, setError] = React.useState<any>({});

    const isCompetitionUnitPostponed = !moment(competitionUnit.startTime).isValid();

    const onFinish = async (values) => {
        let { name, startDate, startTime, isCompleted, calendarEventId, vesselParticipantGroupId, description, approximateStart_zone, courseId } = values;
        let response;
        calendarEventId = eventId || calendarEventId;

        const checkStartTimeValidResult = handleCheckIsStartTimeValid();
        if (!checkStartTimeValidResult.isValid) {
            if (checkStartTimeValidResult.errors?.startTime)
                toast.error(checkStartTimeValidResult.errors.startTime);
            return;
        }

        setIsSaving(true);

        const data: any = {
            name: name,
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

        if (!isCompetitionUnitPostponed) {
            data.startTime = moment(startDate.format(TIME_FORMAT.number) + ' ' + startTime.format(TIME_FORMAT.time)).utc();
            data.approximateStart = moment(startDate.format(TIME_FORMAT.number) + ' ' + startTime.format(TIME_FORMAT.time)).utc();
        }

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
            showToastMessageOnRequestError(response.error);
        }
    }

    const onCompetitionUnitCreated = (response) => {
        toast.success(t(translations.competition_unit_create_update_page.created_a_new_competition_unit, { name: response.data?.name }));
        setCompetitionUnit(response.data);
    }

    const showPostponedMessageToUserIfRaceIsPostponed = (race: CompetitionUnit) => {
        if (!moment(race.startTime).isValid()) {
            toast.info(t(translations.competition_unit_create_update_page.this_race_is_postponed_and_you_can_only));
        }
    }

    const initModeAndData = async () => {
        const isEventExist = await getEventData();
        if (!isEventExist) return;

        if (location.pathname.includes(MODE.UPDATE)) {
            setFormChanged(false);
            setMode(MODE.UPDATE);
            setIsSaving(true);
            const response = await get(eventId, competitionUnitId);
            setIsSaving(false);

            if (response.success) {
                setCompetitionUnit(response.data);
                showPostponedMessageToUserIfRaceIsPostponed(response.data);
                form.setFieldsValue({
                    ...response.data,
                    startDate: moment(response.data?.approximateStart),
                    startTime: moment(response.data?.approximateStart)
                });
                if (response.data?.boundingBox?.coordinates)
                    setBoundingBoxCoordinates(response.data?.boundingBox?.coordinates);
            } else {
                history.push(`/events/${eventId}`);
                message.error(t(translations.competition_unit_create_update_page.race_not_found));
            }
        } else {
            await setDefaultTimeForRace();
            await setDefaultNameForRace();
            checkIfNoRaceIsOngoing();
        }
    }

    const canManageRace = (event: CalendarEvent) => {
        if (!event.isEditor) {
            toast.info(t(translations.competition_unit_create_update_page.your_not_the_event_editor_therefore_you_cannot_edit_the_event))
            history.push('/events');
            return false;
        }

        if ([EventState.COMPLETED, EventState.CANCELED].includes(event.status!)) {
            toast.info(t(translations.competition_unit_create_update_page.event_is_canceled_or_completed_you_cannot_manage_it_from_this_point))
            history.push('/events');
            return false;
        }

        return true;
    }

    const getEventData = async () => {
        const response = await getEventById(eventId);
        if (response.success) {
            setEventData(response.data);
            return canManageRace(response.data);
        }

        history.push('/events');
        message.error(t(translations.competition_unit_create_update_page.event_not_found));
        return false;
    }

    const setDefaultClassForRace = (vesselGroups: VesselParticipantGroup[]) => {
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
        const races = response.data?.rows;

        if (response.success) {
            if (response.data.rows?.length > 0) {
                form.setFieldsValue({
                    startDate: moment(response.data.rows[0].approximateStart),
                    startTime: moment(response.data.rows[0].approximateStart).add(5, 'minutes'),
                })
            }
            form.setFieldsValue({
                name: ('R' + ((Number(response.data?.count) + 1) || 1)),
            });
            setLastCreatedRace(races[0]);
        }
    }

    const setDefaultTimeForRace = async () => {
        const response = await getEventById(eventId);

        if (response.success) {
            form.setFieldsValue({
                startDate: moment(response.data?.approximateStartTime),
                startTime: moment(response.data?.approximateStartTime).add(5, 'minutes'),
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

    const renderErrorField = (error, field) => {
        return error?.[field] || false;
    }

    const handleFieldChange = (field, value) => {
        const currentError = { ...error };
        currentError[field] = '';

        let accumulatedError = {};

        if (field === 'startDate' || field === 'startTime') {
            const checkStartTimeResult = handleCheckIsStartTimeValid();
            accumulatedError = { ...checkStartTimeResult.errors };
        }

        setError({ ...accumulatedError })
    }

    const handleCheckIsStartTimeValid = () => {
        const values = form.getFieldsValue();
        const { startDate, startTime } = values;

        const selectedDate = (startDate || moment())?.toObject();
        const selectedTime = (startTime || moment())?.toObject();
        const selectedDateTime = new Date(selectedDate.years, selectedDate.months, selectedDate.date, selectedTime.hours, selectedTime.minutes, selectedTime.seconds);
        const eventDateTime = new Date(eventData?.approximateStartTime!);

        if (selectedDateTime.getTime() >= eventDateTime.getTime() || isCompetitionUnitPostponed) {
            return {
                isValid: true,
                errors: { startDate: null, startTime: null }
            }
        };

        return {
            isValid: false,
            errors: { startTime: t(translations.competition_unit_create_update_page.error_starttime_greater_eventtime) }
        }
    }

    React.useEffect(() => {
        initUserLocation();
        initModeAndData();
        getAllUserVesselGroups();
        getAllEventCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkIfNoRaceIsOngoing = async () => {
        if (mode === MODE.UPDATE) return;

        const response = await getAllByCalendarEventId(eventId, 1, 1000);

        if (response.success) {
            const races = response.data.rows;
            races.some(race => {
                if (race.status === RaceStatus.ON_GOING) {
                    if (history.action !== 'POP') history.goBack();
                    else history.push(`/events/${eventId}/update`);
                    toast.info(t(translations.competition_unit_create_update_page.please_complete_your_race_before_adding_another))
                    return true;
                }
                return false;
            });
        }
    }

    const getAllEventCourses = async () => {
        const response = await getByEventId(eventId, {
            page: 1,
            size: 100
        });

        if (response.success) {
            const courses = response.data?.rows;
            setCourses(courses);
            if (mode === MODE.CREATE) {
                form.setFieldsValue({ courseId: courses[0]?.id });
            }
        }
    }

    const goBack = () => {
        if (history.action !== 'POP') history.goBack();
        else history.push(`/events/${eventId}`);
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

    const dateLimiter = (current) => {
        if (!eventData.id) {
            return current && current < moment().startOf('day');
        }

        return current && current < moment(new Date(eventData.approximateStartTime!)).startOf('day');
    };

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
                        <Tooltip title={t(translations.tip.delete_race)}>
                            <DeleteButton
                                onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                                    style={{ marginRight: '5px' }}
                                    size={18}
                                />}>{t(translations.general.delete)}</DeleteButton>
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
                        initialValues={{
                            startTime: moment('09:00:00', 'HH:mm:ss'),
                            approximateStart_zone: 'Etc/UTC'
                        }}
                    >

                        <Tooltip title={t(translations.tip.race_name)}>
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.general.name)}</SyrfFieldLabel>}
                                name="name"
                                rules={[{ required: true, message: t(translations.forms.race_name_is_required) }, {
                                    max: 150, message: t(translations.forms.race_name_must_not_be_longer_than_150_chars)
                                }]}
                            >
                                <SyrfInputField />
                            </Form.Item>
                        </Tooltip>

                        <Tooltip title={t(translations.tip.race_description)}>
                            <Form.Item
                                rules={[{ max: 255, message: t(translations.forms.race_description_must_not_be_longer_than_255_chars) }]}
                                label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.description)}</SyrfFieldLabel>}
                                name="description"
                            >

                                <SyrfTextArea />
                            </Form.Item>
                        </Tooltip>

                        <Divider />

                        {!isCompetitionUnitPostponed && <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Tooltip title={t(translations.tip.race_start_date)}>
                                    <Form.Item
                                        label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.start_date)}</SyrfFieldLabel>}
                                        name="startDate"
                                        rules={[{ type: 'date' }, {
                                            required: true,
                                            message: t(translations.forms.start_date_is_required)
                                        }]}
                                    >

                                        <DatePicker
                                            allowClear={false}
                                            className="syrf-datepicker"
                                            showToday={true}
                                            style={{ width: '100%' }}
                                            disabledDate={dateLimiter}
                                            onChange={(val) => handleFieldChange('startDate', val)}
                                            dateRender={current => {
                                                return (
                                                    <div className="ant-picker-cell-inner">
                                                        {current.date()}
                                                    </div>
                                                );
                                            }}
                                        />

                                    </Form.Item>
                                </Tooltip>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Tooltip title={t(translations.tip.race_start_time)}>
                                    <Form.Item
                                        label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.start_time)}</SyrfFieldLabel>}
                                        name="startTime"
                                        rules={[{ required: true, message: t(translations.forms.start_time_is_required) }]}
                                        validateStatus={(renderErrorField(error, 'startTime') && 'error') || ''}
                                        help={renderErrorField(error, 'startTime')}
                                    >

                                        <TimePicker
                                            allowClear={false}
                                            className="syrf-datepicker"
                                            onChange={(val) => handleFieldChange('startTime', val)}
                                        />

                                    </Form.Item>
                                </Tooltip>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Tooltip title={t(translations.tip.race_start_timezone)}>
                                    <Form.Item
                                        label={<SyrfFieldLabel>{t(translations.competition_unit_create_update_page.timezone)}</SyrfFieldLabel>}
                                        name="approximateStart_zone"
                                        rules={[{ required: true }]}
                                    >

                                        <SyrfFormSelect disabled placeholder={t(translations.competition_unit_create_update_page.timezone)}
                                            showSearch
                                            filterOption={(input, option) => {
                                                if (option) {
                                                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }

                                                return false;
                                            }}
                                        >
                                            {renderTimezoneDropdownList()}
                                        </SyrfFormSelect>
                                    </Form.Item>
                                </Tooltip>
                            </Col>
                        </Row>}

                        <BoundingBoxPicker userCoordinates={coordinates} coordinates={boundingBoxCoordinates} onCoordinatesRecevied={onCoordinatesRecevied} />

                        <Tooltip title={t(translations.tip.race_class)}>
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
                        </Tooltip>

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
