import React from 'react';
import styled from 'styled-components';
import { GiPositionMarker } from 'react-icons/gi';
import { Space } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import { renderEmptyValue } from 'utils/helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { ExpeditionServerActionButtons } from 'app/pages/CompetitionUnitCreateUpdatePage/components/ExpeditionServerActionButtons';
import { RegisterEventModal } from 'app/components/RegisterEventModal';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { CreateButton } from 'app/components/SyrfGeneral';
import { FiEdit } from 'react-icons/fi';

export const ResultItem = (props) => {
    const race = props.item;

    const { t } = useTranslation();

    const eventId = race._source?.event;
    const eventText = renderEmptyValue(race._source?.event_name, ' ');
    const eventElement = eventId && race._source.event_name ? <Link to={`/events/${eventId}`}>{eventText}</Link> : eventText;
    const [showRegisterModal, setShowRegisterModal] = React.useState<boolean>(false);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const history = useHistory();

    const showRegiterModalOrRedirect = () => {
        if (isAuthenticated) {
            setShowRegisterModal(true);
        } else {
            history.push('/signin');
        }
    }

    return (
        <>
            <RegisterEventModal
                competition={race._source}
                showModal={showRegisterModal}
                setShowModal={setShowRegisterModal} />
            <Wrapper key={props.index}>
                {race._source?.start_country && <HeadDescriptionWrapper>
                    <Space size={5}>
                        <GiPositionMarker />
                        {[race._source?.start_city, race._source?.start_country].filter(Boolean).join(', ')}
                    </Space>
                </HeadDescriptionWrapper>}
                <Name><Link to={`/playback?raceId=${race._id}`}>{race._source?.name}</Link></Name>
                {race._source?.event_description && <Description>{race._source?.event_description}</Description>}
                <DescriptionWrapper>
                    <DescriptionItem>
                        {t(translations.home_page.filter_tab.filter_result.date)} {moment(race._source?.approx_start_time_ms).format(TIME_FORMAT.date_text)}
                    </DescriptionItem>
                    {race._source?.event_name && <DescriptionItem>
                        {t(translations.home_page.filter_tab.filter_result.event_name)} {eventElement}
                    </DescriptionItem>}
                </DescriptionWrapper>
                <Space size={10}>
                    {race?._source?.id &&
                        race?._source?.source === 'SYRF' &&
                        moment(race._source?.approx_start_time_ms).isAfter(moment())
                        && <ExpeditionServerActionButtons competitionUnit={race._source} />}
                    {
                        race._source?.isOpen && race._source?.allowRegistration && <CreateButton icon={<FiEdit style={{marginRight: '10px'}}/>} onClick={showRegiterModalOrRedirect}>{t(translations.home_page.register_as_competitor)}</CreateButton>
                    }
                </Space>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    border: 1px solid #DADCE0;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    width: 100%;
`;

const Name = styled.h3`
    color: #40a9ff;
    margin: 10px 0;
    padding: 0;
`;

const HeadDescriptionWrapper = styled.div`
    color: #70757a;
`;

const DescriptionWrapper = styled.div``;

const DescriptionItem = styled.span`
    color: #70757a;
    :first-child {
        margin-right: 10px;
    }

    :not(:first-child) {
        margin: 0 5px;
    }
`;

const Description = styled.p`
    font-size: 13px;
`;