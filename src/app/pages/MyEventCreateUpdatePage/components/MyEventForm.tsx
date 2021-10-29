import React from 'react';
import { Spin, Form, DatePicker, Row, Col, Divider, Select, TimePicker, Space, message } from 'antd';
import { DeleteButton, PageDescription, GobackButton, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfFormWrapper, SyrfInputField, SyrfTextArea } from 'app/components/SyrfForm';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { LocationPicker } from './LocationPicker';
import { useForm } from 'antd/lib/form/Form';
import { create, get, update } from 'services/live-data-server/event-calendars';
import { create as createVesselParticipantGroup } from 'services/live-data-server/vessel-participant-group';
import { create as createCompetitionUnit } from 'services/live-data-server/competition-units';
import moment from 'moment-timezone';
import { useHistory, useLocation, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { CompetitionUnitList } from './CompetitionUnitList';
import { MAP_DEFAULT_VALUE } from 'utils/constants';
import { BiTrash } from 'react-icons/bi';
import { DeleteRaceModal } from 'app/pages/MyEventPage/components/DeleteEventModal';
import { IoIosArrowBack } from 'react-icons/io';
import Geocode from "react-geocode";
import ReactTooltip from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';


import { ParticipantList } from './ParticipantList';
import { VesselParticipantGroupList } from './VesselParticipantGroupList';
import { MODE } from 'utils/constants';
import { debounce, renderTimezoneInUTCOffset } from 'utils/helpers';
import { CoursesList } from './CoursesList';
import tzLookup from 'tz-lookup';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API_KEY);

const { getTimeZones } = require("@vvo/tzdb");
const timeZones = getTimeZones();

timeZones.push({
    name: 'Etc/Utc'
});

export const MyEventForm = () => {

    const history = useHistory();

    const location = useLocation();

    const [form] = useForm();

    const [isSavingEvent, setIsSavingEvent] = React.useState<boolean>(false);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>('');

    const { eventId } = useParams<{ eventId: string }>();

    const [coordinates, setCoordinates] = React.useState<any>(MAP_DEFAULT_VALUE.CENTER);

    const [race, setRace] = React.useState<any>({});

    const [error, setError] = React.useState<any>({
        startTime: '',
    });

    const { t } = useTranslation();
    
    const raceListRef = React.useRef<any>();

    const [formChanged, setFormChanged] = React.useState<boolean>(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceAddressTyping = React.useCallback(debounce((value) => getLocationFromAddress(value), 1000), []);

    const onFinish = async (values) => {
        const { name, startDate, externalUrl, lon, lat, endDate, startTime, description, approximateStartTime_zone } = values;
        let response;
        let currentDate = moment();

        if (!checkIfDateTimeValid(values, mode)) {
            handleStartTimeError();
            return;
        }
        
        if (endDate) {
            currentDate = endDate;
        }

        setIsSavingEvent(true);

        const data = {
            name: name,
            externalUrl: externalUrl,
            lon: lon,
            lat: lat,
            description: description,
            approximateStartTime: startDate ? moment(startDate.format("YYYY-MM-DD") + ' ' + startTime.format("HH:mm:ss")).utc() : moment().utc().format("YYYY-MM-DD HH:mm:ss"),
            startDay: startDate.utc().format('DD'),
            startMonth: startDate.utc().format('MM'),
            startYear: startDate.utc().format('YYYY'),
            endDay: currentDate.utc().format('DD'),
            endMonth: currentDate.utc().format('MM'),
            endYear: currentDate.utc().format('YYYY'),
            ics: "ics",
            approximateStartTime_zone: approximateStartTime_zone,
            isPrivate: false,
        };

        if (mode === MODE.CREATE)
            response = await create(data);
        else
            response = await update(eventId, data);

        setIsSavingEvent(false);

        if (response.success) {
            onEventSaved(response, lat, lon);
        } else {
            toast.error(t(translations.my_event_create_update_page.an_error_happened_when_saving_event));
        }
    }

    const onEventSaved = (response, lat, lon) => {
        if (mode === MODE.CREATE) {
            toast.success(t(translations.my_event_create_update_page.created_a_new_event, { name: response.data?.name }));
            setRace(response.data);
            createDefaultVesselParticipantGroup(response.data);
        } else {
            toast.success(t(translations.my_event_create_update_page.successfully_update_event, { name: response.data?.name }));
        }

        history.push(`/events/${response.data?.id}/update`);
        setCoordinates({
            lat: lat,
            lng: lon
        });

        if (raceListRef) raceListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const createANewDefaultCompetitionUnit = async (event, vesselParticipantGroupId) => {
        const data = {
            name: 'R1',
            startTime: event.approximateStartTime,
            approximateStart: event.approximateStartTime,
            vesselParticipantGroupId: vesselParticipantGroupId,
            calendarEventId: event.id,
            approximateStart_zone: event.approximateStartTime_zone
        };

        await createCompetitionUnit(event.id, data);
        setMode(MODE.UPDATE);
        if (raceListRef) raceListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const createDefaultVesselParticipantGroup = async (event) => {
        const data = {
            name: 'Default Class',
            calendarEventId: event.id
        };

        const response = await createVesselParticipantGroup(data);

        if (response.success) {
            createANewDefaultCompetitionUnit(event, response.data.id);
        }
    }

    const onChoosedLocation = (lat, lon) => {
        form.setFieldsValue({
            lat: lat,
            lon: lon
        });

        // Select timezone
        const currentTimezone = tzLookup(lat, lon);
        form.setFieldsValue({ approximateStartTime_zone: currentTimezone });


        // Get address
        Geocode.fromLatLng(parseFloat(lat), parseFloat(lon)).then(
            (response) => {
                const address = response.results[0].formatted_address;
                form.setFieldsValue({ location: address });
            },
            (error) => {
                console.error(error);
            }
        );
    }

    const initMode = async () => {
        resetData();
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);
            setFormChanged(false);
        } else if (location.pathname.includes(MODE.CREATE)) {
            setMode(MODE.CREATE);
            setFormChanged(true);
        }
    }

    const initData = async () => {
        setIsSavingEvent(true);
        const response = await get(eventId);
        setIsSavingEvent(false);

        if (response.success) {
            form.setFieldsValue({
                ...response.data,
                startDate: moment(response.data?.approximateStartTime),
                startTime: moment(response.data?.approximateStartTime)
            });
            setRace(response.data);
            setCoordinates({
                lat: response.data.lat,
                lng: response.data.lon
            });
            onChoosedLocation(response.data.lat, response.data.lon);
        } else {
            message.error(t(translations.my_event_create_update_page.event_not_found));
            history.push('/events');
        }
    }

    const resetData = () => {
        form.resetFields();
    }

    const checkIfDateTimeValid = (values, mode) => {
        if (mode === MODE.UPDATE) return true;

        const { startDate, startTime } = values;
        const currentDate = new Date();

        const selectedDate = (startDate || moment())?.toObject();
        const selectedTime = (startTime || moment())?.toObject();
        const selectedDateTime = new Date(selectedDate.years, selectedDate.months, selectedDate.date, selectedTime.hours, selectedTime.minutes, selectedTime.seconds);

        if (selectedDateTime.getTime() + 3000 <= currentDate.getTime()) return false;
        return true;
    }

    const handleFieldChange = (field, value) => {
        const currentError = { ...error };
        currentError[field] = '';
        setError(currentError);

        if (field === 'startTime' || field === 'startDate') handleStartTimeChange();
    };

    const handleStartTimeChange = () => {
        const values = form.getFieldsValue();

        if (!checkIfDateTimeValid(values, mode)) {
            handleStartTimeError();
            return;
        }

        setError({ ...error, startTime: '' });
    }

    const handleStartTimeError = () => {
        setError({ startTime: t(translations.my_event_create_update_page.starttime_must_be_in_future) });
    }

    const renderErrorField = (error, field) => {
        return error?.[field] || false;
    }

    const initUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                setCoordinates({
                    lat: coords.latitude,
                    lng: coords.longitude
                });
                onChoosedLocation(coords.latitude, coords.longitude);
            });
        }
    }

    React.useEffect(() => {
        initMode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    React.useEffect(() => {
        if (mode === MODE.CREATE) {
            resetData();
            initUserLocation();
        } else if (mode === MODE.UPDATE) {
            initData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const onRaceDeleted = () => {
        history.push('/events');
    }

    const renderTimezoneDropdownList = () => {
        return timeZones.map((timezone, index) => {
            return <Select.Option key={index} value={timezone.name}>{timezone.name + ' ' + renderTimezoneInUTCOffset(timezone.name)}</Select.Option>
        });
    }

    const getLocationFromAddress = (value) => {
        Geocode.fromAddress(value).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                setCoordinates({
                    lat: lat,
                    lng: lng
                });
            },
            (error) => {
                console.error(error);
            }
        );
    }

    const dateLimiter = (current) => {
        if (mode === MODE.UPDATE) return false;
        return current && current < moment().startOf('day');
    };

    return (
        <Wrapper>
            <DeleteRaceModal
                race={race}
                onRaceDeleted={onRaceDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoOutterWrapper>
                    <GobackButton onClick={() => history.push("/events")}>
                        <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                    </GobackButton>
                    <PageInfoContainer>
                        <PageHeading>{mode === MODE.UPDATE ?
                            t(translations.my_event_create_update_page.update_your_event)
                            : t(translations.my_event_create_update_page.create_a_new_event)}</PageHeading>
                        <PageDescription>{t(translations.my_event_create_update_page.events_are_regattas)}</PageDescription>
                    </PageInfoContainer>
                </PageInfoOutterWrapper>
                <Space size={10}>
                    {mode === MODE.UPDATE && <>
                        <DeleteButton data-tip={t(translations.tip.delete_event)} onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                            style={{ marginRight: '5px' }}
                            size={18} />}>{t(translations.my_event_create_update_page.delete)}</DeleteButton>
                    </>}

                </Space>
            </PageHeaderContainerResponsive>
            <SyrfFormWrapper>
                <Spin spinning={isSavingEvent}>
                    <Form
                        onValuesChange={() => setFormChanged(true)}
                        layout={'vertical'}
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                        initialValues={{
                            startDate: moment(),
                            startTime: moment(new Date()).add(1, 'h'),
                            approximateStartTime_zone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        }}
                    >
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.name)}</SyrfFieldLabel>}
                            name="name"
                            className="event-name-step"
                            data-tip={t(translations.tip.name_of_the_event)}
                            rules={[{ required: true, message: t(translations.forms.event_name_is_required) },
                            {   
                                max: 150, message: t(translations.forms.event_name_must_not_be_longer_than_150_chars)
                            }]}
                        >
                            <SyrfInputField autoCorrect="off" />
                        </Form.Item>

                        <Form.Item
                            rules={[{ max: 255, message: t(translations.forms.event_description_must_not_be_longer_than_255_chars) }]}
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.description)}</SyrfFieldLabel>}
                            name="description"
                            className="event-description-step"
                            data-multiline={true}
                            data-tip={t(translations.tip.event_description)}
                        >
                            <SyrfTextArea autoCorrect="off" />
                        </Form.Item>

                        <Divider />

                        <Row gutter={24} style={{ display: 'none' }}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.longitude)}</SyrfFieldLabel>}
                                    name="lon"
                                    rules={[{ required: true }]}
                                >
                                    <SyrfInputField disabled />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.latitude)}</SyrfFieldLabel>}
                                    name="lat"
                                    rules={[{ required: true }]}
                                >
                                    <SyrfInputField disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.location)}</SyrfFieldLabel>}
                            name="location"
                            className="event-location-step"
                            data-tip={t(translations.tip.event_location)}
                            rules={[{ required: true, message: t(translations.forms.location_is_required) }]}
                        >
                            <SyrfInputField onChange={(e) => debounceAddressTyping(e.target.value)} autoCorrect="off" />
                        </Form.Item>

                        <LocationPicker coordinates={coordinates} setFormChanged={setFormChanged} onChoosedLocation={onChoosedLocation} />

                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.start_date)}</SyrfFieldLabel>}
                                    name="startDate"
                                    className="event-start-date-step"
                                    data-tip={t(translations.tip.event_start_date)}
                                    rules={[{ type: 'date' }, {
                                        required: true,
                                        message: t(translations.forms.start_date_is_required)
                                    }]}
                                    validateStatus={(renderErrorField(error, 'startDate') && 'error') || ''}
                                    help={renderErrorField(error, 'startDate')}
                                >
                                    <DatePicker
                                        allowClear={false}
                                        onChange={(val) => handleFieldChange('startDate', val)} 
                                        showToday={true}
                                        disabledDate={dateLimiter}
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
                                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.start_time)}</SyrfFieldLabel>}
                                    name="startTime"
                                    className="event-start-time-step"
                                    data-tip={t(translations.tip.event_start_time)}
                                    rules={[{ required: true, message: t(translations.forms.start_time_is_required) }]}
                                    validateStatus={(renderErrorField(error, 'startTime') && 'error') || ''}
                                    help={renderErrorField(error, 'startTime')}
                                >
                                    <TimePicker 
                                        allowClear={false}
                                        onChange={(val) => handleFieldChange('startTime', val)} 
                                        className="syrf-datepicker" 
                                        defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} 
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.timezone)}</SyrfFieldLabel>}
                                    name="approximateStartTime_zone"
                                    className="event-time-zone-step"
                                    data-tip={t(translations.tip.event_time_zone)}
                                    rules={[{ required: true }]}
                                >
                                    <SyrfFormSelect placeholder={t(translations.my_event_create_update_page.timezone)}
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

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.external_url)}</SyrfFieldLabel>}
                            name="externalUrl"
                            className="event-external-website-step"
                            data-tip={t(translations.tip.event_website)}
                            rules={[{ type: 'url', message: t(translations.forms.external_url_is_not_a_valid_url) }]}
                        >
                            <SyrfInputField autoCorrect="off" />
                        </Form.Item>

                        <Form.Item>
                            <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                                {t(translations.my_event_create_update_page.save_event)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>

            {
                mode === MODE.UPDATE && (
                    <>
                        <SyrfFormWrapper ref={raceListRef} style={{ marginTop: '30px' }}>
                            <CompetitionUnitList eventId={eventId} />
                        </SyrfFormWrapper>

                        <SyrfFormWrapper style={{ marginTop: '30px' }}>
                            <VesselParticipantGroupList eventId={eventId} />
                        </SyrfFormWrapper>

                        <SyrfFormWrapper style={{ marginTop: '30px' }}>
                            <ParticipantList eventId={eventId} />
                        </SyrfFormWrapper>

                        <SyrfFormWrapper style={{ marginTop: '30px' }}>
                            <CoursesList eventId={eventId} />
                        </SyrfFormWrapper>
                    </>
                )
            }
            <ReactTooltip />
        </Wrapper>
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