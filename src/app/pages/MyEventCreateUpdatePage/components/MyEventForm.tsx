import React from 'react';
import { Spin, Form, DatePicker, Row, Col, Divider, Select, TimePicker, Menu, Space, message } from 'antd';
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
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import { ParticipantList } from './ParticipantList';
import { VesselParticipantGroupList } from './VesselParticipantGroupList';
import { MODE } from 'utils/constants';
import { renderTimezoneInUTCOffset } from 'utils/helpers';
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
    const [endCoordinates, setEndCoordinates] = React.useState<any>(null);

    const [race, setRace] = React.useState<any>({});

    const [error, setError] = React.useState<any>({
        startTime: '',
    });

    const [address, setAddress] = React.useState<string>('');
    const [endAddress, setEndAddress] = React.useState<string>('');

    const { t } = useTranslation();
    
    const raceListRef = React.useRef<any>();

    const [formChanged, setFormChanged] = React.useState<boolean>(true);

    const onFinish = async (values) => {
        const { name, startDate, externalUrl, lon, lat, endDate, endTime, startTime, description, approximateStartTime_zone, approximateEndTime_zone, endLat, endLon } = values;
        let response;
        let currentDate = moment();
        let currentTime = moment();

        const startTimeValidation = handleCheckIsStartTimeValid();
        const endTimeValidation = handleCheckIsEndDateTimeValid();

        if (!startTimeValidation.isValid || !endTimeValidation.isValid) {
            setError({ ...startTimeValidation.errors, ...endTimeValidation.errors })
            return;
        }        
        
        if (endDate) {
            currentDate = endDate;
        }

        if (endTime) {
            currentTime = endTime;
        }

        setIsSavingEvent(true);

        const data = {
            name: name,
            externalUrl: externalUrl,
            lon: lon,
            lat: lat,
            endLon: endLon,
            endLat: endLat,
            description: description,
            approximateStartTime: startDate ? moment(startDate.format("YYYY-MM-DD") + ' ' + startTime.format("HH:mm:ss")).utc() : moment().utc().format("YYYY-MM-DD HH:mm:ss"),
            approximateEndTime: moment(currentDate.format('YYYY-MM-DD') + ' ' + currentTime.format("HH:mm:ss")).utc(),
            startDay: startDate.utc().format('DD'),
            startMonth: startDate.utc().format('MM'),
            startYear: startDate.utc().format('YYYY'),
            endDay: currentDate.utc().format('DD'),
            endMonth: currentDate.utc().format('MM'),
            endYear: currentDate.utc().format('YYYY'),
            ics: "ics",
            approximateStartTime_zone: approximateStartTime_zone,
            approximateEndTime_zone: approximateEndTime_zone,
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

    const onChoosedLocation = (lat, lon, shouldFetchAddress = true, shouldUpdateCoordinate = false, selector = 'start') => {
        
        if (selector === 'start') {
            form.setFieldsValue({
                lat: lat,
                lon: lon
            });
        } else {
            form.setFieldsValue({
                endLat: lat,
                endLon: lon
            });
        }

        // Select timezone
        const currentTimezone = tzLookup(lat, lon);

        if (selector === 'start') {
            form.setFieldsValue({ approximateStartTime_zone: currentTimezone });
        } else {
            form.setFieldsValue({ approximateEndTime_zone: currentTimezone })
        }


        // Get address
        if (shouldFetchAddress) {
            Geocode.fromLatLng(parseFloat(lat), parseFloat(lon)).then(
                (response) => {
                    const address = response.results[0].formatted_address;
                    
                    if (selector === 'start') {
                        form.setFieldsValue({ location: address });
                        setAddress(address);
                    } else {
                        form.setFieldsValue({ endLocation: address });
                        setEndAddress(address);
                    }
                },
                (error) => {
                    console.error(error);
                }
            );
        }

        if (shouldUpdateCoordinate) {
            
            if (selector === 'start') {
                setCoordinates({
                    lat: lat,
                    lon: lon
                });
            } else {
                setEndCoordinates({
                    lat: lat, 
                    lon: lon
                })
            }
            
        }
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

    const handleFieldChange = (field, value) => {
        const currentError = { ...error };
        currentError[field] = '';

        let accumulatedError = {};

        if (field === 'startDate') {
            // Check start date
            const checkStartTimeResult = handleCheckIsStartTimeValid();
            accumulatedError = { ...checkStartTimeResult.errors };

            // Check end date only
            const checkEndDateResult = handleCheckIsEndDateValid();
            accumulatedError = { ...accumulatedError, ...checkEndDateResult.errors }
            
            if (checkEndDateResult.isValid) {
                // If date valid, compare (start and end) date-time
                const checkEndDateTimeResult = handleCheckIsEndDateTimeValid();
                accumulatedError = { ...accumulatedError, ...checkEndDateTimeResult.errors }
            }
        }

        if (field === 'startTime') {
            // Check start date
            const checkStartTimeResult = handleCheckIsStartTimeValid();
            accumulatedError = { ...checkStartTimeResult.errors };

            // Compare (start and end) date-time
            const checkEndDateTimeResult = handleCheckIsEndDateTimeValid();
            accumulatedError = { ...accumulatedError, ...checkEndDateTimeResult.errors }
        }

        if (field === 'endDate' || field === 'endTime') {
            const checkEndDateTimeResult = handleCheckIsEndDateTimeValid();
            accumulatedError = { ...accumulatedError, ...checkEndDateTimeResult.errors }
        }

        setError({ ...error, ...accumulatedError });
    };

    // Check if endDate > startDate and reset if false
    const handleCheckIsEndDateValid = () => {
        const { startDate, endDate } = form.getFieldsValue();
        if (!endDate) {
            form.setFieldsValue({ endTime: null });
            return {
                isValid: true,
                errors: { endDate: null, endTime: null }
            };
        }

        const startDt = startDate._d.getTime();
        const endDt = endDate._d.getTime();

        if (startDt < endDt) return {
            isValid: true,
            errors: { endDate: null, endTime: null }
        };
        
        form.setFieldsValue({ endTime: null });
        return {
            isValid: false,
            errors: { endDate: t(translations.my_event_create_update_page.error_enddate_should_greater_than_startdate) }
        };        
    }

    const handleCheckIsEndDateTimeValid = () => {
        const { startDate, endDate, startTime, endTime } = form.getFieldsValue();
        setError({ ...error, endDate: null, endTime: null });

        if (!endDate && !endTime) {
            return {
                isValid: true,
                errors: { endDate: null, endTime: null }
            };
        }

        if (!endDate) {
            form.setFieldsValue({ endTime: null });
            return {
                isValid: false,
                errors: { endDate: t(translations.my_event_create_update_page.error_enddate_should_selected) }
            };
        };

        if (!endTime) {
            return {
                isValid: false,
                errors: { endTime: t(translations.my_event_create_update_page.error_endtime_should_selected) }
            };
        }

        const selectedStartDate = (startDate || moment())?.toObject();
        const selectedStartTime = (startTime || moment())?.toObject();
        const selectedStartDateTime = new Date(selectedStartDate.years, selectedStartDate.months, selectedStartDate.date, selectedStartTime.hours, selectedStartTime.minutes, selectedStartTime.seconds);


        const selectedEndDate = (endDate || moment())?.toObject();
        const selectedEndTime = (endTime || moment())?.toObject();
        const selectedEndDateTime = new Date(selectedEndDate.years, selectedEndDate.months, selectedEndDate.date, selectedEndTime.hours, selectedEndTime.minutes, selectedEndTime.seconds);

        form.setFieldsValue({ endTime: endTime || moment() })
        
        if (selectedEndDateTime.getTime() + 5000 > selectedStartDateTime.getTime()) 
            return {
                isValid: true,
                errors: { endDate: null, endTime: null }
            };

        return {
            isValid: false,
            errors: {
                endTime: t(translations.my_event_create_update_page.error_endtime_shouldgreater_starttime)
            }
        }
    }

    const handleAddressChange = (addr) => {
        setAddress(addr);
    }

    const handleEndAddressChange = (addr) => {
        setEndAddress(addr);

        if (!addr) {
            form.setFieldsValue({
                approximateEndTime_zone: null,
                endLocation: ''
            });

            setEndCoordinates(null);
        }
    }

    const handleSelectAddress = (addr) => {
        setAddress(addr);
        geocodeByAddress(addr)
            .then(results => getLatLng(results[0]))
            .then(coordinate => onChoosedLocation(coordinate.lat, coordinate.lng, false, true))
            .catch(error => console.log('Geocode map err', error))
    }

    const handleSelectEndAddress = (addr) => {
        setEndAddress(addr);

        if (!addr) { 
            form.setFieldsValue({ 
                approximateEndTime_zone: null,
                endLocation: ''
            });

            setEndCoordinates(null);

            return;
        }

        geocodeByAddress(addr)
            .then(results => getLatLng(results[0]))
            .then(coordinate => onChoosedLocation(coordinate.lat, coordinate.lng, false, true, 'end'))
            .catch(error => console.log('Geocode map err', error))
    }

    const handleCheckIsStartTimeValid = () => {
        const values = form.getFieldsValue();
        setError({ ...error, startDate: null, startTime: null });

        if (mode === MODE.UPDATE) {
            return {
                isValid: true,
                errors: { startDate: null, endDate: null }
            }
        };

        const { startDate, startTime } = values;
        const currentDate = new Date();

        const selectedDate = (startDate || moment())?.toObject();
        const selectedTime = (startTime || moment())?.toObject();
        const selectedDateTime = new Date(selectedDate.years, selectedDate.months, selectedDate.date, selectedTime.hours, selectedTime.minutes, selectedTime.seconds);

        if (selectedDateTime.getTime() + 3000 > currentDate.getTime()) {
            return {
                isValid: true,
                errors: { startDate: null, startTime: null }
            }
        };

        return {
            isValid: false,
            errors: { startTime: t(translations.my_event_create_update_page.error_starttime_shouldgreater_currenttime) }
        }
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

    const handleRemoveEventLocation = () => {
        setEndAddress('');
        setEndCoordinates(null);
        form.setFieldsValue({
            approximateEndTime_zone: null,
            endLocation: '',
            endLat: null,
            endLon: null
        });

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

    const dateLimiter = (current) => {
        if (mode === MODE.UPDATE) return false;
        return current && current < moment().startOf('day');
    };

    const endDateLimiter = (current) => {
        const { startDate } = form.getFieldsValue();
        const currentStartDate = (startDate || moment());
        return current && current < currentStartDate.startOf('day');
    }

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

                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.latitude)}</SyrfFieldLabel>}
                                    name="endLat"
                                    rules={[{ required: false }]}
                                >
                                    <SyrfInputField disabled />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.latitude)}</SyrfFieldLabel>}
                                    name="endLon"
                                    rules={[{ required: false }]}
                                >
                                    <SyrfInputField disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        <LocationPicker onRemoveEndLocation={handleRemoveEventLocation} coordinates={coordinates} endCoordinates={endCoordinates} setFormChanged={setFormChanged} onChoosedLocation={onChoosedLocation} />

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.start_location)}</SyrfFieldLabel>}
                            name="location"
                            className="event-location-step"
                            data-tip={t(translations.tip.event_location_start)}
                            rules={[{ required: true, message: t(translations.forms.location_is_required) }]}
                        >
                            <PlacesAutocomplete
                                value={address}
                                onChange={handleAddressChange}
                                onSelect={handleSelectAddress}
                            >
                                 {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                                    return (
                                    <>
                                        <SyrfInputField
                                            {...getInputProps({
                                                placeholder: t(translations.profile_page.update_profile.search_places),
                                                className: 'location-search-input',
                                            })}
                                            value={address}
                                            autoCorrect="off"
                                        />
                                        {suggestions.length > 0 && <StyledPLaceDropdown>
                                            {suggestions.map((suggestion) => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                return (
                                                    <Menu.Item
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                        key={suggestion.index}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </Menu.Item>
                                                );
                                            })}
                                        </StyledPLaceDropdown>}
                                    </>
                                )}}   
                            </PlacesAutocomplete>
                        </Form.Item>

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
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.end_location)}</SyrfFieldLabel>}
                            name="endLocation"
                            className="event-location-step"
                            data-tip={t(translations.tip.event_location_end)}
                        >
                            <PlacesAutocomplete
                                value={address}
                                onChange={handleEndAddressChange}
                                onSelect={handleSelectEndAddress}
                            >
                                 {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                                    return (
                                    <>
                                        <SyrfInputField
                                            {...getInputProps({
                                                placeholder: t(translations.profile_page.update_profile.search_places),
                                                className: 'location-search-input',
                                            })}
                                            allowClear
                                            value={endAddress}
                                            autoCorrect="off"
                                        />
                                        {suggestions.length > 0 && <StyledPLaceDropdown>
                                            {suggestions.map((suggestion) => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                return (
                                                    <Menu.Item
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                        key={suggestion.index}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </Menu.Item>
                                                );
                                            })}
                                        </StyledPLaceDropdown>}
                                    </>
                                )}}   
                            </PlacesAutocomplete>
                        </Form.Item>

                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.end_date)}</SyrfFieldLabel>}
                                    name="endDate"
                                    className="event-start-date-step"
                                    data-tip={t(translations.tip.event_end_date)}
                                    validateStatus={(renderErrorField(error, 'endDate') && 'error') || ''}
                                    help={renderErrorField(error, 'endDate')}
                                >
                                    <DatePicker
                                        onChange={(val) => handleFieldChange('endDate', val)} 
                                        showToday={true}
                                        disabledDate={endDateLimiter}
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
                                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.end_time)}</SyrfFieldLabel>}
                                    name="endTime"
                                    className="event-start-time-step"
                                    data-tip={t(translations.tip.event_end_time)}
                                    validateStatus={(renderErrorField(error, 'endTime') && 'error') || ''}
                                    help={renderErrorField(error, 'endTime')}
                                >
                                    <TimePicker 
                                        onChange={(val) => handleFieldChange('endTime', val)} 
                                        className="syrf-datepicker" 
                                        defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} 
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.timezone)}</SyrfFieldLabel>}
                                    name="approximateEndTime_zone"
                                    className="event-time-zone-step"
                                    data-tip={t(translations.tip.event_time_zone)}
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

const StyledPLaceDropdown = styled(Menu)`
    position: absolute;
    z-index: 2;
    background: #fff;
    border: 1px solid #d9d9d9;
    width: 100%;
`;
