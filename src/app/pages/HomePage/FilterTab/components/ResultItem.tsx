import React from 'react';
import styled from 'styled-components';
import { GiPositionMarker } from 'react-icons/gi';
import { Space, Dropdown, Menu, Tooltip } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import { canStreamToExpedition, renderEmptyValue, showToastMessageOnRequestError } from 'utils/helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { RaceSource, RaceStatus, TIME_FORMAT, UserRole } from 'utils/constants';
import { ExpeditionServerActionButtons } from 'app/pages/CompetitionUnitCreateUpdatePage/components/ExpeditionServerActionButtons';
import { RegisterRaceModal } from 'app/components/RegisterRaceModal';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from 'app/pages/LoginPage/slice/selectors';
import { CreateButton, LiveDot } from 'app/components/SyrfGeneral';
import { FiEdit } from 'react-icons/fi';
import { selectRelations, selectResults, selectUpcomingRaces } from '../../slice/selectors';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { forceDeleteCompetitionUnit, markCompetitionUnitAsCompleted, markCompetitionUnitAsHidden } from 'services/live-data-server/competition-units';
import { toast } from 'react-toastify';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { useHomeSlice } from '../../slice';

export const ResultItem = (props) => {

    const race = props.item;

    const { t } = useTranslation();

    const relations = useSelector(selectRelations);

    const [relation, setRelation] = React.useState<any>(null);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const eventId = race._source?.event;
    const eventText = renderEmptyValue(race._source?.event_name, ' ');
    const eventElement = eventId && race._source.event_name ? <Link to={`/events/${eventId}`}>{eventText}</Link> : eventText;
    const [showRegisterModal, setShowRegisterModal] = React.useState<boolean>(false);
    const [showMarkAsHiddenConfirmModal, setShowMarkAsHiddenConfirmModal] = React.useState<boolean>(false);
    const [showMarkAsCompletedConfirmModal, setShowMarkAsCompletedConfirmModal] = React.useState<boolean>(false);
    const [showDeleteRaceConfirmModal, setShowDeleteRaceConfirmModal] = React.useState<boolean>(false);

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const authUser = useSelector(selectUser);

    const canManageRace = () => {
        return authUser.role === UserRole.SUPER_ADMIN && race._source?.source !== RaceSource.SYRF;
    };

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const results = useSelector(selectResults);

    const upcomingResults = useSelector(selectUpcomingRaces);

    const history = useHistory();

    const showRegisterModalOrRedirect = () => {
        if (isAuthenticated) {
            setShowRegisterModal(true);
        } else {
            history.push('/signin');
        }
    }

    const canRegister = () => {
        return relation && !relation?.isAdmin && !relation?.isParticipating
            && race._source?.isOpen && race._source?.allowRegistration
            && [RaceStatus.SCHEDULED].includes(race._source?.status);
    };

    React.useEffect(() => {
        if (relations.length > 0) {
            setRelation(relations.find(r => r.id === race._source.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [relations]);

    const showMarkAsHiddenModal = () => {
        setShowMarkAsHiddenConfirmModal(true);
    }

    const showMarkAsCompletedModal = () => {
        setShowMarkAsCompletedConfirmModal(true);
    }

    const showDeleteRaceModal = () => {
        setShowDeleteRaceConfirmModal(true);
    }

    const markAsHidden = async () => {
        setIsLoading(true);
        const response = await markCompetitionUnitAsHidden(race._source.id);
        setIsLoading(false);

        if (response.success) {
            setShowMarkAsHiddenConfirmModal(false);
            toast.success(t(translations.general.your_action_is_successful));
            updateResults(race._source.id);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const markAsCompleted = async () => {
        setIsLoading(true);
        const response = await markCompetitionUnitAsCompleted(race._source.id);
        setIsLoading(false);

        if (response.success) {
            setShowMarkAsCompletedConfirmModal(false);
            toast.success(t(translations.general.your_action_is_successful));
            updateResults(race._source.id);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const forceDeleteRace = async () => {
        setIsLoading(true);
        const response = await forceDeleteCompetitionUnit(race._source.id);
        setIsLoading(false);

        if (response.success) {
            setShowDeleteRaceConfirmModal(false);
            toast.success(t(translations.general.your_action_is_successful));
            updateResults(race._source.id);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const updateResults = (raceIdToFilter) => {
        const filteredSearchResults = results.filter(r => r._source.id !== raceIdToFilter);
        const filteredUpcomingResults = upcomingResults.filter(r => r._source.id !== raceIdToFilter);
        dispatch(actions.setUpcomingRaceResults(filteredUpcomingResults))
        dispatch(actions.setResults(filteredSearchResults));
    }

    const isNotCompleted = () => {
        return !race._source.approx_end_time_ms || (race._source.approx_end_time_ms && moment(race._source.approx_end_time_ms).isSameOrAfter(moment()));
    }

    const menu = (
        <Menu>
            <Menu.Item onClick={showMarkAsHiddenModal}>
                {t(translations.home_page.filter_tab.filter_result.mark_as_hidden)}
            </Menu.Item>
            {
                isNotCompleted() && <Menu.Item onClick={showMarkAsCompletedModal}>
                    {t(translations.home_page.filter_tab.filter_result.mark_as_completed)}
                </Menu.Item>
            }
            <Menu.Item onClick={showDeleteRaceModal}>
                {t(translations.home_page.filter_tab.filter_result.delete_this_race)}
            </Menu.Item>
        </Menu>
    );

    const renderLiveDot = () => {
        if ([RaceStatus.ON_GOING].includes(race._source?.status)) {
            if (!moment(race._source.approx_start_time_ms).isValid())
                return <span>{t(translations.home_page.filter_tab.filter_result.postponed)}</span>; // showing race is postponed.
            return <LiveDotWrapper>
                <span>{t(translations.general.live)} <LiveDot className='live'></LiveDot></span>
            </LiveDotWrapper>;
        }

        return <></>;
    }

    return (
        <>
            <ConfirmModal
                loading={isLoading}
                showModal={showMarkAsHiddenConfirmModal}
                title={t(translations.home_page.filter_tab.filter_result.are_you_sure_you_want_to_mark_this_race_as_hidden)}
                content={t(translations.home_page.filter_tab.filter_result.this_race_will_be_hidden_are_you_sure_you_want_to_continue)}
                onOk={markAsHidden}
                onCancel={() => setShowMarkAsHiddenConfirmModal(false)}
            />
            <ConfirmModal
                loading={isLoading}
                showModal={showMarkAsCompletedConfirmModal}
                title={t(translations.home_page.filter_tab.filter_result.are_you_sure_you_want_to_mark_this_race_as_completed)}
                content={t(translations.home_page.filter_tab.filter_result.this_race_will_be_marked_as_completed_are_you_sure_you_want_to_continue)}
                onOk={markAsCompleted}
                onCancel={() => setShowMarkAsCompletedConfirmModal(false)}
            />
            <ConfirmModal
                loading={isLoading}
                showModal={showDeleteRaceConfirmModal}
                title={t(translations.home_page.filter_tab.filter_result.are_you_sure_you_want_to_force_delete_this_race)}
                content={t(translations.home_page.filter_tab.filter_result.this_race_will_be_deleted_are_you_sure_you_want_to_continue)}
                onOk={forceDeleteRace}
                onCancel={() => setShowDeleteRaceConfirmModal(false)}
            />
            <RegisterRaceModal
                setRelation={setRelation}
                showModal={showRegisterModal}
                setShowModal={setShowRegisterModal}
                raceName={race._source?.name}
                lon={race._source?.approx_start_point?.coordinates[0]}
                lat={race._source?.approx_start_point?.coordinates[1]}
                eventId={race._source.event}
                raceId={race._source?.id} />
            <Wrapper key={props.index}>
                <HeadDescriptionWrapper>
                    <Space size={5}>
                        {race._source?.start_country ?
                            <>
                                <GiPositionMarker />
                                {[race._source?.start_city, race._source?.start_country].filter(Boolean).join(', ')}
                            </> : <div></div>
                        }
                    </Space>
                    <RightResultWrapper>
                        {renderLiveDot()}
                        {canManageRace() && <Tooltip title={t(translations.tip.super_admin_options)}>
                            <StyledDropDown overlay={menu} placement="bottomCenter" icon={<StyledOptionsButton />} />
                        </Tooltip>}
                    </RightResultWrapper>
                </HeadDescriptionWrapper>
                <Name>
                    <Tooltip title={t(translations.home_page.filter_tab.filter_result.watch_this_race, { raceName: race._source?.name })}>
                        <Link to={`/playback?raceId=${race._id}`}>{race._source?.name}</Link>
                    </Tooltip>
                </Name>
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
                    {isAuthenticated && canStreamToExpedition(race._source?.id, race._source?.source, race._source?.status, false) && <ExpeditionServerActionButtons competitionUnit={race._source} />}
                    {canRegister() && <CreateButton
                        icon={<FiEdit
                            style={{ marginRight: '10px' }} />}
                        onClick={showRegisterModalOrRedirect}>{t(translations.home_page.register_as_competitor)}</CreateButton>
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
    position: relative;
`;

const Name = styled.h3`
    color: #40a9ff;
    margin: 10px 0;
    padding: 0;
`;

const HeadDescriptionWrapper = styled.div`
    color: #70757a;
    display: flex;
    justify-content: space-between;
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

const StyledOptionsButton = styled(IoEllipsisHorizontal)`
    font-size: 22px;
`;

const StyledDropDown = styled(Dropdown.Button)`
   button {
    border: none;
   }
`;

const LiveDotWrapper = styled.div`
   color: red;
   span {
       margin-left: 3px;
   }
`;

const RightResultWrapper = styled.div`
    display: flex;
    align-items: center;
`
