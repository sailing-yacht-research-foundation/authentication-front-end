import React from 'react';
import { Button, message, Space, Spin, Tag } from 'antd';
import { GobackButton, IconWrapper, PageHeaderContainerResponsive, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import { LocationPicker } from 'app/pages/MyEventCreateUpdatePage/components/LocationPicker';
import { FaSave } from 'react-icons/fa';
import styled from 'styled-components';
import { EventState, MAP_DEFAULT_VALUE, TIME_FORMAT } from 'utils/constants';
import { RaceList } from './RaceList';
import { useHistory, useParams } from 'react-router';
import { downloadIcalendarFile, get, toggleOpenForRegistration } from 'services/live-data-server/event-calendars';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { renderTimezoneInUTCOffset, showToastMessageOnRequestError } from 'utils/helpers';
import { IoIosArrowBack } from 'react-icons/io';
import { Share } from 'app/pages/PlaybackPage/components/Share';
import { EventAdmins } from './EventAdmins';
import { AiOutlineCalendar } from 'react-icons/ai';
import { VesselList } from './VesselList';
import { toast } from 'react-toastify';
import { GiArchiveRegister } from 'react-icons/gi';
import { HiLockClosed } from 'react-icons/hi';
import { CalendarEvent } from 'types/CalendarEvent';
import { PDFUploadForm } from 'app/pages/MyEventCreateUpdatePage/components/PDFUploadForm';

export const EventDetail = () => {

    const { eventId } = useParams<{ eventId: string }>();

    const [event, setEvent] = React.useState<Partial<CalendarEvent>>({});

    const [coordinates, setCoordinates] = React.useState<{ lat: number, lng: number }>(MAP_DEFAULT_VALUE.CENTER);
    const [endCoordinates, setEndCoordinates] = React.useState<any>(null);

    const [isFetchingEvent, setIsFetchingEvent] = React.useState<boolean>(false);

    const [isOpeningClosingRegistration, setIsOpeningClosingRegistration] = React.useState<boolean>(false);

    const history = useHistory();

    const { t } = useTranslation();

    const toggleRegistration = async (allowRegistration: boolean) => {
        setIsOpeningClosingRegistration(true);
        const response = await toggleOpenForRegistration(eventId, allowRegistration);
        setIsOpeningClosingRegistration(false);

        if (response.success) {
            setEvent({
                ...event,
                allowRegistration: allowRegistration
            })
            if (allowRegistration) {
                toast.info(t(translations.my_event_create_update_page.event_is_opened_for_registration));
            } else {
                toast.info(t(translations.my_event_create_update_page.event_is_closed_for_registration));
            }
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const menus = [
        {
            name: t(translations.my_event_create_update_page.open_registration),
            show: event.isOpen && event.allowRegistration === false && ![EventState.CANCELED, EventState.COMPLETED].includes(event.status!),
            handler: () => toggleRegistration(true),
            icon: <GiArchiveRegister />,
            spinning: isOpeningClosingRegistration,
            isDelete: false,
        },
        {
            name: t(translations.my_event_create_update_page.close_registration),
            show: event.isOpen && event.allowRegistration === true && ![EventState.CANCELED, EventState.COMPLETED].includes(event.status!),
            handler: () => toggleRegistration(false),
            icon: <HiLockClosed />,
            spinning: isOpeningClosingRegistration,
            isDelete: false,
        }
    ];

    React.useEffect(() => {
        fetchEvent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]);

    const fetchEvent = async () => {
        setIsFetchingEvent(true);
        const response = await get(eventId);
        setIsFetchingEvent(false);

        if (response.success) {
            const { data } = response;

            setEvent(response.data);
            setCoordinates({
                lat: data.lat,
                lng: data.lon
            });

            if (data.endLat && data.endLon) {
                setEndCoordinates({
                    lat: data.endLat,
                    lng: data.endLon
                });
            } else {
                setEndCoordinates(null);
            }
        } else {
            message.error(t(translations.event_detail_page.event_not_found));
            history.push('/events');
        }
    }

    const renderCityAndCountryText = (event) => {
        return [event?.city, event?.country].filter(Boolean).join(', ');
    }

    const goBack = () => {
        if (history.action !== 'POP') history.goBack();
        else history.push('/events');
    }

    const translate = {
        status_open_regis: t(translations.my_event_list_page.status_openregistration),
        status_public: t(translations.my_event_list_page.status_publicevent),
        status_private: t(translations.my_event_list_page.status_privateevent),
        anyone_canregist: t(translations.tip.anyone_can_register_event_and_tracking),
        anyone_canview: t(translations.tip.anyone_can_search_view_event),
        only_owner_canview: t(translations.tip.only_owner_cansearch_view_event)
    }

    const canManageEvent = () => {
        return event.isEditor && ![EventState.COMPLETED, EventState.CANCELED].includes(event.status!);
    }

    const navigateToEventHostProfile = (profileId) => {
        if (!profileId) return;
        history.push(`/profile/${profileId}`);
    }

    return (
        <Spin spinning={isFetchingEvent}>
            <PageHeaderContainerResponsive>
                <PageInfoOutterWrapper>
                    <GobackButton onClick={() => goBack()}>
                        <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                    </GobackButton>
                    <EventHeaderInfoContainer style={{ marginTop: '10px' }}>
                        <EventTitle>{event.name}</EventTitle>
                        {event.createdBy?.name && <EventHoldBy>{t(translations.event_detail_page.organized_by)} <EventHost onClick={() => navigateToEventHostProfile(event.createdById)}>{event.createdBy?.name}</EventHost></EventHoldBy>}
                        <EventDate>{moment(event.approximateStartTime).format(TIME_FORMAT.date_text_with_time)} {event.approximateStartTime_zone} {renderTimezoneInUTCOffset(event.approximateStartTime_zone)} {event.city} {event.country}</EventDate>
                    </EventHeaderInfoContainer>
                </PageInfoOutterWrapper>
                <EventActions>
                    <Space wrap style={{ justifyContent: 'flex-end' }}>
                        {
                            canManageEvent() &&
                            <>
                                {menus.map((item, index) => {
                                    return item.show && <Spin key={index} spinning={item.spinning}>
                                        {<Button shape="round" onClick={item.handler} icon={<IconWrapper>{item.icon}</IconWrapper>}>{item.name}</Button>}
                                    </Spin>
                                })}
                                <Button shape="round" type="primary" onClick={() => history.push(`/events/${event.id}/update`)} icon={<FaSave style={{ marginRight: '10px' }} />}>{t(translations.event_detail_page.update_this_event)}</Button>
                            </>
                        }
                        <Button type="link" data-tip={t(translations.tip.download_icalendar_file)} onClick={() => {
                            downloadIcalendarFile(event);
                        }}>
                            <AiOutlineCalendar style={{ fontSize: '23px' }} />
                        </Button>
                        <Share style={{ position: 'relative', bottom: 'auto', right: 'auto' }} />
                    </Space>
                </EventActions>
            </PageHeaderContainerResponsive>

            <LocationPicker hideLocationControls onChoosedLocation={() => { }} noMarkerInteraction locationDescription={renderCityAndCountryText(event)} zoom="10" coordinates={coordinates} endCoordinates={endCoordinates} height="270px" noPadding />

            <EventDescriptionContainer>
                <EventSection>
                    <EventSectionHeading>{t(translations.event_detail_page.about_this_event)}</EventSectionHeading>
                    <EventDescription>
                        {event.description ? event.description : t(translations.home_page.filter_tab.filter_result.no_description)}
                    </EventDescription>

                    <EventOpenRegistrationContainer>
                        {event?.isOpen && <StyledTag data-tip={translate.anyone_canregist} color="blue">{translate.status_open_regis}</StyledTag>}
                        {!event?.isOpen && <StyledTag data-tip={translate.only_owner_canview}>{translate.status_private}</StyledTag>}
                    </EventOpenRegistrationContainer>
                </EventSection>
            </EventDescriptionContainer>

            {event.id &&
                <>
                    <EventSection>
                        <EventAdmins event={event} />
                    </EventSection>

                    <EventSection>
                        <RaceList canManageEvent={canManageEvent} event={event} />
                    </EventSection>

                    <EventSection>
                        <VesselList event={event} />
                    </EventSection>

                    <PDFUploadForm reloadParent={fetchEvent} fullWidth event={event} />
                </>
            }
        </Spin>
    );
}

const EventTitle = styled.h2``;

const EventDate = styled.p`
 font-size: 13px;
 margin-bottom: 0px;
`;

const EventHoldBy = styled.div`
 margin-bottom: 5px;
 color: #6e6d7a;
`;

const EventHost = styled.a`
    
`;

const EventHeaderInfoContainer = styled.div`
    margin-top: 10px;
    margin-left: 15px;
`;

const EventActions = styled.div`
    text-align: right;
`;

const EventDescription = styled.p`
    padding: 0px;
    text-align: left;
    margin-bottom: 0px;
`;

const EventSectionHeading = styled.h3``;

const EventSection = styled.div`
    padding: 10px 15px;
`;

const EventDescriptionContainer = styled.div`
    margin: 16px 0px;
`;

const EventOpenRegistrationContainer = styled.div`
    margin: 16px 0px;
    max-width: 300px;
`;

const StyledTag = styled(Tag)`
    margin-top: 4px;
    margin-bottom: 4px;
`;