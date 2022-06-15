import React from 'react';
import { Spin, Form, Divider, Select, Button } from 'antd';
import { PageDescription, GobackButton, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import { SyrfFormButton, SyrfFormWrapper } from 'app/components/SyrfForm';
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
import { AdminType, EventParticipatingTypes, EventState, MAP_DEFAULT_VALUE, MODE, requiredCompetitorsInformation } from 'utils/constants';
import { DeleteEventModal } from 'app/pages/MyEventPage/components/DeleteEventModal';
import { IoIosArrowBack } from 'react-icons/io';
import Geocode from "react-geocode";
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import { renderTimezoneInUTCOffset, showToastMessageOnRequestError } from 'utils/helpers';
import tzLookup from 'tz-lookup';
import { AssignEventAsGroupAdminModal } from 'app/pages/MyEventPage/components/modals/AssignEventAsGroupAdminModal';
import { ActionButtons } from './ActionButtons';
import { EventChildLists } from './EventChildLists';
import { FormItemEventNameDescription } from './FormItemEventNameDescription';
import { FormItemHidden } from './FormItemHidden';
import { FormItemStartLocationAddress } from './FormItemStartLocationAddress';
import { FormItemEndLocationAddress } from './FormItemEndLocationAddress';
import { FormItemStartDate } from './FormItemStartDate';
import { FormItemEndDate } from './FormItemEndDate';
import { ImportEventDataModal } from './modals/ImportEventDataModal';
import { create as createCourse } from 'services/live-data-server/courses';
import { FormItems } from './FormItems';
import { CalendarEvent } from 'types/CalendarEvent';

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
    const { eventId } = useParams<{ eventId: string }>();
    const { t } = useTranslation();

    const [isSavingEvent, setIsSavingEvent] = React.useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
    const [showAssignModal, setShowAssignModal] = React.useState<boolean>(false);
    const [mode, setMode] = React.useState<string>('');
    const [coordinates, setCoordinates] = React.useState<any>(MAP_DEFAULT_VALUE.CENTER);
    const [endCoordinates, setEndCoordinates] = React.useState<any>(null);
    const [event, setEvent] = React.useState<Partial<CalendarEvent>>({});
    const [address, setAddress] = React.useState<string>('');
    const [endAddress, setEndAddress] = React.useState<string>('');
    const [formChanged, setFormChanged] = React.useState<boolean>(true);
    const [showImportEventModal, setShowImportEventModal] = React.useState<boolean>(false);

    const raceListRef = React.useRef<any>();

    const pdfListRef = React.useRef<any>();

    const onFinish = async (values) => {
        const { startDate, isOpen, lon, lat, endDate, requiredFields,
            endTime, startTime, endLat, endLon, admins,
            requiredCertifications, requireCovidCertificate,
        } = values;

        let response;
        let requiredCompetitorFields = requiredFields || [];
        let currentDate = moment();
        let currentTime = moment();
        const editors = admins ? admins.map(item => JSON.parse(item)) : [];
        const certifications = requiredCertifications || [];

        if (endDate) {
            currentDate = endDate;
        }

        if (endTime) {
            currentTime = endTime;
        }

        const data = {
            ...values,
            endLocation: endLon && endLat ? {
                lon: endLon,
                lat: endLat
            } : null,
            approximateStartTime: startDate ? moment(startDate.format("YYYY-MM-DD") + ' ' + startTime.format("HH:mm:ss")).utc() : moment().utc().format("YYYY-MM-DD HH:mm:ss"),
            approximateEndTime: moment(currentDate.format('YYYY-MM-DD') + ' ' + currentTime.format("HH:mm:ss")).utc(),
            startDay: startDate.utc().format('DD'),
            startMonth: startDate.utc().format('MM'),
            startYear: startDate.utc().format('YYYY'),
            endDay: currentDate.utc().format('DD'),
            endMonth: currentDate.utc().format('MM'),
            endYear: currentDate.utc().format('YYYY'),
            ics: "ics",
            isPrivate: false,
            isOpen: !!isOpen,
            isCrewed: false,
            requireCovidCertificate: !!requireCovidCertificate,
            editors: editors.filter(item => item.type === AdminType.INDIVIDUAL).map(item => ({
                id: item.id
            })),
            groupEditors: editors.filter(item => item.type === AdminType.GROUP).map(item => ({
                id: item.id,
                isIndividualAssignment: item.isIndividualAssignment
            })),
            participatingFee: (values.participatingFee && values.participatingFee !== 0) ? values.participatingFee : undefined,
            requiredCertifications: certifications,
            organizerGroupId: values.organizerGroupId || null,
        };

        requiredCompetitorsInformation.forEach((field) => {
            data[field] = requiredCompetitorFields.includes(field);
        });

        setIsSavingEvent(true);

        if (mode === MODE.CREATE)
            response = await create(data);
        else {
            response = await update(eventId, data);
        }

        if (response.success) {
            onEventSaved(response, { lat, lon }, endLat ? { lat: endLat, lon: endLon } : null);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const onEventSaved = async (response, startLocation, endLocation) => {
        if (mode === MODE.CREATE) {
            toast.success(t(translations.my_event_create_update_page.created_a_new_event, { name: response.data?.name }));
            setEvent(response.data);
            await createDefaultVesselParticipantGroup(response.data);
            setCoordinates({
                lat: startLocation.lat,
                lng: startLocation.lon
            });

            if (endLocation) {
                setEndCoordinates({
                    lat: endLocation.lat,
                    lng: endLocation.lon
                })
            }
        } else {
            await initData();
            toast.success(t(translations.my_event_create_update_page.successfully_update_event, { name: response.data?.name }));
        }

        setIsSavingEvent(false);
        pdfListRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const reloadParent = () => {
        initData();
    }

    const createANewDefaultCompetitionUnit = async (event, vesselParticipantGroupId, courseId) => {
        const data = {
            name: 'R1',
            startTime: event.approximateStartTime,
            approximateStart: event.approximateStartTime,
            vesselParticipantGroupId: vesselParticipantGroupId,
            calendarEventId: event.id,
            approximateStart_zone: event.approximateStartTime_zone,
            courseId: courseId
        };

        const response = await createCompetitionUnit(event.id, data);

        if (response.success) {
            toast.success(t(translations.competition_unit_create_update_page.created_a_new_competition_unit, { name: response.data.name }));
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setMode(MODE.UPDATE);
        history.push(`/events/${event.id}/update`);
        pdfListRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const createDefaultVesselParticipantGroup = async (event) => {
        const data = {
            name: 'Default Class',
            calendarEventId: event.id
        };

        const response = await createVesselParticipantGroup(data);

        if (response.success) {
            toast.success(t(translations.vessel_participant_group_create_update_page.created_a_new_group, { name: response.data?.name }))
            const couseId = await createDefaultCourse(event);
            await createANewDefaultCompetitionUnit(event, response.data.id, couseId);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const createDefaultCourse = async (event) => {
        const response = await createCourse(event.id, 'Default Course', []);

        if (response.success) {
            toast.success(t(translations.my_event_create_update_page.successfully_created_a_new_default_course_for_this_event));
            return response.data.id;
        }
        else showToastMessageOnRequestError(response.error);

        return undefined;
    }

    const onChoosedLocation = (lat, lon, shouldFetchAddress = true, shouldUpdateCoordinate = false, selector = 'start') => {
        if (!lat || !lon) return;

        console.log(lat, lon);

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
                    const address = response?.results[0]?.formatted_address;

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
                    lng: lon
                });
            } else {
                setEndCoordinates({
                    lat: lat,
                    lng: lon
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

    const canManageEvent = (event) => {
        if (!event.isEditor) {
            toast.info(t(translations.my_event_create_update_page.your_not_the_event_editor_therefore_you_cannot_edit_the_event))
            history.push('/events');
            return false;
        }

        if ([EventState.COMPLETED, EventState.CANCELED].includes(event.status)) {
            toast.info(t(translations.my_event_create_update_page.event_is_canceled_or_completed_you_cannot_manage_it_from_this_point))
            history.push('/events');
            return false;
        }

        return true;
    }

    const initData = async () => {
        setIsSavingEvent(true);
        const response = await get(eventId || event?.id!);
        setIsSavingEvent(false);

        if (response.success) {

            if (!canManageEvent(response.data)) return;

            form.setFieldsValue({
                ...response.data,
                startDate: moment(response.data?.approximateStartTime),
                startTime: moment(response.data?.approximateStartTime),
                endDate: moment(response.data?.approximateEndTime),
                endTime: moment(response.data?.approximateEndTime),
                endLat: response.data?.endLocation?.coordinates[1] || response.data?.lat,
                endLon: response.data?.endLocation?.coordinates[0] || response.data?.lon,
                admins: [...response.data?.editors.map(editor => JSON.stringify({
                    type: AdminType.INDIVIDUAL,
                    id: editor.id,
                    avatar: editor.avatar,
                    name: editor.name,
                    isIndividualAssignment: false
                })), ...response.data?.groups.map(editor => JSON.stringify({
                    type: AdminType.GROUP,
                    id: editor.id,
                    avatar: editor.groupImage,
                    name: editor.groupName,
                    isIndividualAssignment: false
                }))],
                requiredCertifications: response.data?.requiredCertifications
            });
            setEvent(response.data);
            setCoordinates({
                lat: response.data?.lat,
                lng: response.data?.lon
            });
            onChoosedLocation(response.data.lat, response.data.lon);

            if (response.data?.endLocation) {
                const endLat = response.data?.endLocation?.coordinates[1];
                const endLon = response.data?.endLocation?.coordinates[0]
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
                <ActionButtons setShowImportEventModal={setShowImportEventModal} event={event} eventId={eventId} mode={mode} setEvent={setEvent} setShowDeleteModal={setShowDeleteModal} />
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
                            approximateEndTime_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            endDate: moment().add(2, 'days'),
                            endTime: moment({ hour: 0, minute: 0, second: 0 }),
                            isOpen: true,
                            participatingFeeType: EventParticipatingTypes.PERSON
                        }}
                    >
                        <FormItemEventNameDescription event={event} />

                        <Divider />

                        <FormItemHidden />

                        <LocationPicker onRemoveEndLocation={handleRemoveEventLocation} coordinates={coordinates} endCoordinates={endCoordinates} setFormChanged={setFormChanged} onChoosedLocation={onChoosedLocation} />

                        <FormItemStartLocationAddress address={address} handleAddressChange={handleAddressChange} handleSelectAddress={handleSelectAddress} />

                        <FormItemStartDate form={form} dateLimiter={dateLimiter} renderTimezoneDropdownList={renderTimezoneDropdownList} />

                        <FormItemEndLocationAddress form={form} address={address} endAddress={endAddress} handleEndAddressChange={handleEndAddressChange} handleSelectEndAddress={handleSelectEndAddress} />

                        <FormItemEndDate form={form} endDateLimiter={endDateLimiter} renderTimezoneDropdownList={renderTimezoneDropdownList} />

                        <FormItems event={event} mode={mode} form={form} />

                        <Form.Item>
                            <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                                {t((event.status === EventState.DRAFT || mode === MODE.CREATE) ? translations.my_event_create_update_page.save_draft : translations.my_event_create_update_page.save_event)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>
            <EventChildLists reloadParent={reloadParent} setEvent={setEvent} eventId={eventId} event={event} mode={mode} pdfListRef={pdfListRef} raceListRef={raceListRef} />
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

export const NowButton = styled(Button)`
    position: absolute;
    bottom: 8px;
`;