import React from 'react';
import { Button, Space, Spin } from 'antd';
import { PageHeaderContainerResponsive } from 'app/components/SyrfGeneral';
import { LocationPicker } from 'app/pages/MyEventCreateUpdatePage/components/LocationPicker';
import { FaCalendarPlus, FaSave } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import styled from 'styled-components';
import { MAP_DEFAULT_VALUE, TIME_FORMAT } from 'utils/constants';
import SailCover from '../assets/sail-banner.jpg';
import { RaceList } from './RaceList';
import { useHistory, useParams } from 'react-router';
import { get } from 'services/live-data-server/event-calendars';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { renderTimezoneInUTCOffset } from 'utils/helpers';

const userId = localStorage.getItem('user_id');

export const EventDetail = () => {

    const { eventId } = useParams<{ eventId: string }>();

    const [event, setEvent] = React.useState<any>({});

    const [coordinates, setCoordinates] = React.useState<any>(MAP_DEFAULT_VALUE.CENTER);

    const [isFetchingEvent, setIsFetchingEvent] = React.useState<boolean>(false);

    const history = useHistory();

    const { t } = useTranslation();

    React.useEffect(() => {
        fetchEvent();
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
            history.push('/404');
        }
    }

    const renderCityAndCountryText = (event) => {
        let location = event.city ? event.city : ' ';
        location += (event.country ? event.country : ' ');

        return location;
    }

    return (
        <Spin spinning={isFetchingEvent}>
            <SailBanner src={SailCover} />
            <PageHeaderContainerResponsive>
                <EventHeaderInfoContainer style={{ marginTop: '10px' }}>
                    <EventTitle>{event.name}</EventTitle>
                    <EventHoldBy>{t(translations.event_detail_page.organized_by)} <EventHost>{event.createdBy?.name}</EventHost></EventHoldBy>
                    <EventDate>{moment(event.startTime).format(TIME_FORMAT.date_text_with_time)} {event.approximateStartTime_zone} {renderTimezoneInUTCOffset(event.approximateStartTime_zone)} {event.city} {event.country}</EventDate>
                </EventHeaderInfoContainer>
                <EventActions>
                    <Space>
                        {
                            userId && event.createdById === userId ? (
                                <Button shape="round" type="primary" onClick={() => history.push(`/events/${event.id}/update`)} icon={<FaSave style={{ marginRight: '10px' }} />}>{t(translations.event_detail_page.update_this_event)}</Button>

                            ) : (
                                <Button icon={<FaCalendarPlus style={{ marginRight: '5px' }} />} shape="round" type="primary">{t(translations.event_detail_page.attend_this_event)}</Button>
                            )
                        }
                        <ShareButton shape="round" icon={<FiUserPlus style={{ marginRight: '5px' }} />}>{t(translations.event_detail_page.invite_friends)}</ShareButton>
                    </Space>
                </EventActions>
            </PageHeaderContainerResponsive>

            <EventSection>
                <EventSectionHeading>{t(translations.event_detail_page.about_this_event)}</EventSectionHeading>
                <EventDescription>
                    {event.description ? event.description : t(translations.home_page.filter_tab.filter_result.no_description)}
                </EventDescription>
                <LocationPicker onChoosedLocation={() => { }} locationDescription={renderCityAndCountryText(event)} zoom="15" coordinates={coordinates} height="250px" />
            </EventSection>

            <EventSection>
                {event.id && <RaceList event={event} />}
            </EventSection>
        </Spin>
    );
}

const SailBanner = styled.img`
    width: 100%;
    height: 250px;
    object-fit: cover;
`;

const EventTitle = styled.h2`

`;

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

`;

const EventActions = styled.div`
    text-align: right;
`;

const ShareButton = styled(Button)`
    color: #40a9ff;
    border-color: #40a9ff;
`;

const EventDescription = styled.p`
    padding: 0px;
    text-align: center;
`;

const EventSectionHeading = styled.h3`

`;

const EventSection = styled.div`
    padding: 10px 15px;
`;