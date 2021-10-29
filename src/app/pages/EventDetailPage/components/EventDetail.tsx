import React from 'react';
import { Button, message, Space, Spin } from 'antd';
import { GobackButton, PageHeaderContainerResponsive, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import { LocationPicker } from 'app/pages/MyEventCreateUpdatePage/components/LocationPicker';
import { FaCalendarPlus, FaSave } from 'react-icons/fa';
import styled from 'styled-components';
import { MAP_DEFAULT_VALUE, TIME_FORMAT } from 'utils/constants';
import { RaceList } from './RaceList';
import { useHistory, useParams } from 'react-router';
import { get } from 'services/live-data-server/event-calendars';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { renderTimezoneInUTCOffset } from 'utils/helpers';
import { IoIosArrowBack } from 'react-icons/io';
import { Share } from 'app/pages/PlaybackPage/components/Share';

let userId;

export const EventDetail = () => {

    const { eventId } = useParams<{ eventId: string }>();

    const [event, setEvent] = React.useState<any>({});

    const [coordinates, setCoordinates] = React.useState<any>(MAP_DEFAULT_VALUE.CENTER);

    const [isFetchingEvent, setIsFetchingEvent] = React.useState<boolean>(false);

    const history = useHistory();

    const { t } = useTranslation();

    React.useEffect(() => {
        fetchEvent();
        userId = localStorage.getItem('user_id'); // get userId everytime the component renders.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchEvent = async () => {
        setIsFetchingEvent(true);
        const response = await get(eventId);
        setIsFetchingEvent(false);

        if (response.success) {

            setEvent(response.data);
            setCoordinates({
                lat: response.data.lat,
                lng: response.data.lon
            });
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

    return (
        <Spin spinning={isFetchingEvent}>
            <LocationPicker onChoosedLocation={() => { }} noMarkerInteraction locationDescription={renderCityAndCountryText(event)} zoom="10" coordinates={coordinates} height="270px" noPadding />
            <PageHeaderContainerResponsive>
                <PageInfoOutterWrapper>
                    <GobackButton onClick={() => goBack()}>
                        <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                    </GobackButton>
                    <EventHeaderInfoContainer style={{ marginTop: '10px' }}>
                        <EventTitle>{event.name}</EventTitle>
                        {event.createdBy?.name && <EventHoldBy>{t(translations.event_detail_page.organized_by)} <EventHost>{event.createdBy?.name}</EventHost></EventHoldBy>}
                        <EventDate>{moment(event.approximateStartTime).format(TIME_FORMAT.date_text_with_time)} {event.approximateStartTime_zone} {renderTimezoneInUTCOffset(event.approximateStartTime_zone)} {event.city} {event.country}</EventDate>
                    </EventHeaderInfoContainer>
                </PageInfoOutterWrapper>
                <EventActions>
                    <Space>
                        {
                            userId && event.createdById === userId ? (
                                <Button shape="round" type="primary" onClick={() => history.push(`/events/${event.id}/update`)} icon={<FaSave style={{ marginRight: '10px' }} />}>{t(translations.event_detail_page.update_this_event)}</Button>

                            ) : (
                                <Button icon={<FaCalendarPlus style={{ marginRight: '5px' }} />} shape="round" type="primary">{t(translations.event_detail_page.attend_this_event)}</Button>
                            )
                        }
                        <Share style={{ position: 'relative', bottom: 'auto', right: 'auto' }} />
                    </Space>
                </EventActions>
            </PageHeaderContainerResponsive>

            <EventSection>
                <EventSectionHeading>{t(translations.event_detail_page.about_this_event)}</EventSectionHeading>
                <EventDescription>
                    {event.description ? event.description : t(translations.home_page.filter_tab.filter_result.no_description)}
                </EventDescription>
            </EventSection>

            <EventSection>
                {event.id && <RaceList event={event} />}
            </EventSection>
        </Spin>
    );
}

const EventTitle = styled.h2``;

const EventDate = styled.p`
 font-size: 13px;
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
`;

const EventSectionHeading = styled.h3`

`;

const EventSection = styled.div`
    padding: 10px 15px;
`;