import React from 'react';
import { Spin, Form, Divider, Select, message } from 'antd';
import { PageDescription, GobackButton, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import { SyrfFieldLabel, SyrfFormButton, SyrfInputField, SyrfFormWrapper } from 'app/components/SyrfForm';
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
import { MAP_DEFAULT_VALUE, MODE } from 'utils/constants';
import { DeleteEventModal } from 'app/pages/MyEventPage/components/DeleteEventModal';
import { IoIosArrowBack } from 'react-icons/io';
import Geocode from "react-geocode";
import ReactTooltip from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import { renderTimezoneInUTCOffset, showToastMessageOnRequestError } from 'utils/helpers';
import tzLookup from 'tz-lookup';
import { AssignEventAsGroupAdminModal } from 'app/pages/MyEventPage/components/AssignEventAsGroupAdminModal';
import { ActionButtons } from './ActionButtons';
import { EventChildLists } from './EventChildLists';
import { FormItemEventNameDescription } from './FormItemEventNameDescription';
import { FormItemHidden } from './FormItemHidden';
import { FormItemStartLocationAddress } from './FormItemStartLocationAddress';
import { FormItemEndLocationAddress } from './FormItemEndLocationAddress';
import { FormItemStartDate } from './FormItemStartDate';
import { FormItemEndDate } from './FormItemEndDate';
import { ImportEventDataModal } from './modals/ImportEventDataModal';

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

    const [showAssignModal, setShowAssignModal] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>('');

    const { eventId } = useParams<{ eventId: string }>();

    const [coordinates, setCoordinates] = React.useState<any>(MAP_DEFAULT_VALUE.CENTER);
    const [endCoordinates, setEndCoordinates] = React.useState<any>(null);

    const [event, setEvent] = React.useState<any>({});

    const [error, setError] = React.useState<any>({
        startTime: '',
    });

    const [address, setAddress] = React.useState<string>('');
    const [endAddress, setEndAddress] = React.useState<string>('');

    const { t } = useTranslation();

    const raceListRef = React.useRef<any>();

    const [formChanged, setFormChanged] = React.useState<boolean>(true);

    const [showImportEventModal, setShowImportEventModal] = React.useState<boolean>(false);

    const onFinish = async (values) => {
        const { name, startDate, externalUrl, isOpen, lon, lat, endDate, endTime, startTime, description, approximateStartTime_zone, approximateEndTime_zone, endLat, endLon } = values;
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
            endLocation: {
                lon: endLon || lon,
                lat: endLat || lat
            },
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
            isOpen: !!isOpen
        };

        if (mode === MODE.CREATE)
            response = await create(data);
        else {
            response = await update(eventId, data);
            setIsSavingEvent(false);
        }

        if (response.success) {
            onEventSaved(response, { lat, lon }, { lat: endLat || lat, lon: endLon || lon });
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const onEventSaved = (response, startLocation, endLocation) => {
        if (mode === MODE.CREATE) {
            toast.success(t(translations.my_event_create_update_page.created_a_new_event, { name: response.data?.name }));
            setEvent(response.data);
            createDefaultVesselParticipantGroup(response.data);
            setCoordinates({
                lat: startLocation.lat,
                lng: startLocation.lon
            });

            setEndCoordinates({
                lat: endLocation.lat,
                lng: endLocation.lon
            })
        } else {
            initData();
            toast.success(t(translations.my_event_create_update_page.successfully_update_event, { name: response.data?.name }));
        }

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
        history.push(`/events/${event.id}/update`);
        setIsSavingEvent(false);
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

            // end location is null
            if (!form.getFieldValue('endLat') && !form.getFieldValue('endLon')) {
                form.setFieldsValue({
                    endLat: lat,
                    endLon: lon
                });
            }
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
                    const address = response?.results[0]?.formatted_address;

                    if (selector === 'start') {
                        form.setFieldsValue({ location: address });
                        setAddress(address);
                        // end location is null, set address to end address 
                        if (!form.getFieldValue('endLocation')) {
                            setEndAddress(address);
                        }
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
        const response = await get(eventId || event?.id);
        setIsSavingEvent(false);

        if (response.success) {
            form.setFieldsValue({
                ...response.data,
                startDate: moment(response.data?.approximateStartTime),
                startTime: moment(response.data?.approximateStartTime),
                endDate: moment(response.data?.approximateEndTime),
                endTime: moment(response.data?.approximateEndTime),
                endLat: response?.data?.endLocation?.coordinates[1] || response?.data?.lat,
                endLon: response?.data?.endLocation?.coordinates[0] || response?.data?.lon
            });
            setEvent(response.data);
            setCoordinates({
                lat: response?.data?.lat,
                lng: response?.data?.lon
            });
            onChoosedLocation(response.data.lat, response.data.lon);

            if (response?.data?.endLocation) {
                const endLat = response?.data?.endLocation?.coordinates[1];
                const endLon = response?.data?.endLocation?.coordinates[0]
                setEndCoordinates({
                    lat: endLat,
                    lng: endLon
                });
                onChoosedLocation(endLat, endLon, true, true, 'end');
            }
        } else {
            showToastMessageOnRequestError(response.error);
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

    const showAssignEventAsGroupAdminModal = () => {
        setShowAssignModal(true);
    }

    return (
        <Wrapper>
            <DeleteEventModal
                event={event}
                onRaceDeleted={onRaceDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <ImportEventDataModal calendarEventId={event.id} showModal={showImportEventModal} setShowModal={setShowImportEventModal} />
            <AssignEventAsGroupAdminModal showModal={showAssignModal} event={event} setShowModal={setShowAssignModal} />
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
                <ActionButtons setShowImportEventModal={setShowImportEventModal} event={event} eventId={eventId} mode={mode} setEvent={setEvent} setShowDeleteModal={setShowDeleteModal} showAssignEventAsGroupAdminModal={showAssignEventAsGroupAdminModal} />
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
                            approximateStartTime_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            endDate: moment().add(2, 'days'),
                            endTime: moment({ hour: 0, minute: 0, second: 0 })
                        }}
                    >
                        <FormItemEventNameDescription />

                        <Divider />

                        <FormItemHidden />

                        <LocationPicker onRemoveEndLocation={handleRemoveEventLocation} coordinates={coordinates} endCoordinates={endCoordinates} setFormChanged={setFormChanged} onChoosedLocation={onChoosedLocation} />

                        <FormItemStartLocationAddress address={address} handleAddressChange={handleAddressChange} handleSelectAddress={handleSelectAddress} />

                        <FormItemStartDate dateLimiter={dateLimiter} error={error} handleFieldChange={handleFieldChange} renderErrorField={renderErrorField} renderTimezoneDropdownList={renderTimezoneDropdownList} />

                        <FormItemEndLocationAddress address={address} endAddress={endAddress} handleEndAddressChange={handleEndAddressChange} handleSelectEndAddress={handleSelectEndAddress} />

                        <FormItemEndDate renderErrorField={renderErrorField} error={error} handleFieldChange={handleFieldChange} endDateLimiter={endDateLimiter} renderTimezoneDropdownList={renderTimezoneDropdownList} />

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
            <EventChildLists eventId={eventId} event={event} mode={mode} raceListRef={raceListRef} />
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