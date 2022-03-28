import { Button, message, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BiSave, BiTrash } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import { MapContainer } from 'react-leaflet';
import { useHistory, useLocation, useParams } from 'react-router';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

import { StyleConstants } from 'styles/StyleConstants';
import { MODE } from 'utils/constants';
import { MAP_DEFAULT_VALUE } from 'utils/constants';
import { DeleteButton, GobackButton, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import { get } from 'services/live-data-server/event-calendars';
import { MapView } from './MapView';
import { useSelector } from 'react-redux';
import { selectUserCoordinate } from 'app/pages/LoginPage/slice/selectors';

const NAV_HEIGHT = '150px';

export const MapViewTab = () => {

    const { t } = useTranslation();

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const [currentEvent, setCurrentEvent] = React.useState<any>({});

    const mapViewRef = React.useRef<any>();

    const location = useLocation();

    const params = useParams<any>();

    const history = useHistory();

    const userCoordinate = useSelector(selectUserCoordinate);

    const mapContainerRef = React.useRef<any>();

    const translate = {
        eventNotFound: t(translations.course_create_update_page.event_not_found)
    }

    const handleResize = () => {
        window.addEventListener('resize', performResize);
    }

    const performResize = () => {
        const navBarHeight = 73;
        const tabBarHeight = 150;
        if (mapContainerRef.current) {
            mapContainerRef.current._container.style.height = `${window.innerHeight - navBarHeight - tabBarHeight}px`;
        }
    }

    const handleGetCurrentEvent = async (eventId) => {
        try {
            if (!eventId) throw new Error(translate.eventNotFound);

            const response = await get(eventId);
            if (!response.success) throw response?.error;
            setCurrentEvent(response.data);

        } catch (err: any) {
            message.error(translate.eventNotFound);
            history.push("/events");
        }
    }

    React.useEffect(() => {
        handleResize();
        if (location.pathname.includes(MODE.UPDATE))
            setMode(MODE.UPDATE);

        handleGetCurrentEvent(params?.eventId);


        return () => {
            window.removeEventListener('resize', performResize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const mapCoordinate = currentEvent?.lat || currentEvent?.lon ?
            [currentEvent.lat || 0, currentEvent.lon || 0] :
            undefined;

        if (mapCoordinate) {
            setTimeout(() => {
                mapContainerRef.current?.flyTo(mapCoordinate, 9, {
                    animate: true,
                    duration: 1
                });
            }, 500);
        }

    }, [currentEvent]);

    const mapCenter = {
        lat: userCoordinate?.lat || MAP_DEFAULT_VALUE.CENTER.lat,
        lng: userCoordinate?.lon || MAP_DEFAULT_VALUE.CENTER.lng
    }

    return (
        <Wrapper>
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoOutterWrapper>
                    <GobackButton onClick={() => mapViewRef.current.goBack()}>
                        <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                    </GobackButton>
                    <PageInfoContainer>
                        <PageHeading>{mode === MODE.UPDATE ? t(translations.course_create_update_page.update_course) : t(translations.course_create_update_page.create_a_new_course)}</PageHeading>
                        <PageDescription>{t(translations.course_create_update_page.creating_a_start_line)}</PageDescription>
                    </PageInfoContainer>
                </PageInfoOutterWrapper>
                <Space size={10}>
                    <Button data-tip={t(translations.tip.save_course)} style={{ borderRadius: '5px' }} onClick={() => mapViewRef.current.saveCourse()} type="primary" icon={<BiSave style={{ marginRight: '5px' }} />}>
                        {t(translations.course_create_update_page.save)}
                    </Button>
                    {mode === MODE.UPDATE &&
                        <>
                            <DeleteButton data-tip={t(translations.tip.delete_course)} onClick={() => mapViewRef.current?.deleteCourse()} danger icon={<BiTrash
                                style={{ marginRight: '5px' }}
                                size={18} />}>{t(translations.general.delete)}</DeleteButton>
                            <ReactTooltip />
                        </>}

                </Space>
            </PageHeaderContainerResponsive>
            <MapContainer whenCreated={(mapInstance: any) => (mapContainerRef.current = mapInstance)} style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT} - ${NAV_HEIGHT})`, width: 'calc(100%)', zIndex: 1 }} center={mapCenter} zoom={MAP_DEFAULT_VALUE.ZOOM}>
                <MapView ref={mapViewRef} />
            </MapContainer>
            <ReactTooltip />
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;