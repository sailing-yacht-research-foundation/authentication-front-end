import { Button, Space } from 'antd';
import { DeleteButton, GobackButton, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BiSave, BiTrash } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import { MapContainer } from 'react-leaflet';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { MAP_DEFAULT_VALUE } from 'utils/constants';
import { MapView } from './MapView';
import { MODE } from 'utils/constants';

const NAV_HEIGHT = '150px';

export const MapViewTab = () => {

    const { t } = useTranslation();

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const mapViewRef = React.useRef<any>();

    const location = useLocation();

    const mapContainerRef = React.useRef<any>();

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

    React.useEffect(() => {
        handleResize();
        if (location.pathname.includes(MODE.UPDATE))
            setMode(MODE.UPDATE);

        return () => {
            window.removeEventListener('resize', performResize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    <Button style={{ borderRadius: '5px' }} onClick={() => mapViewRef.current.saveCourse()} type="primary" icon={<BiSave style={{ marginRight: '5px' }} />}>
                        {t(translations.course_create_update_page.save)}
                    </Button>
                    {mode === MODE.UPDATE && <DeleteButton onClick={() => mapViewRef.current?.deleteCourse()} danger icon={<BiTrash
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.course_create_update_page.delete)}</DeleteButton>}

                </Space>
            </PageHeaderContainerResponsive>
            <MapContainer whenCreated={(mapInstance: any) => (mapContainerRef.current = mapInstance)} style={{ height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT} - ${NAV_HEIGHT})`, width: 'calc(100%)', zIndex: 1 }} center={MAP_DEFAULT_VALUE.CENTER} zoom={MAP_DEFAULT_VALUE.ZOOM}>
                <MapView ref={mapViewRef} />
            </MapContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;