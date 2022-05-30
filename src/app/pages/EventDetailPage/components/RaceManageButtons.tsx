import React from 'react';
import { Space, Tooltip } from 'antd';
import { BorderedButton, CreateButton } from 'app/components/SyrfGeneral';
import { EventState, RaceStatus } from 'utils/constants';
import { FiEdit } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { RegisterRaceModal } from 'app/components/RegisterRaceModal';
import { CompetitionUnit } from 'types/CompetitionUnit';
import { CalendarEvent } from 'types/CalendarEvent';
import { StopRaceConfirmModal } from 'app/pages/MyEventCreateUpdatePage/components/modals/StopRaceConfirmModal';

interface IRaceManageButtons {
    race: CompetitionUnit,
    canManageEvent: Function,
    event: CalendarEvent,
    setCompetitionUnit: Function,
    showRegisterModal: boolean,
    setShowRegisterModal: Function,
    isAuthenticated: boolean,
    showDeleteRaceModal: Function,
    relations: any[],
    reloadParent?: Function
}

export const RaceManageButtons = (props: IRaceManageButtons) => {
    const { race, reloadParent, canManageEvent, event, setCompetitionUnit,
        showRegisterModal, setShowRegisterModal, isAuthenticated, showDeleteRaceModal, relations } = props;

    const history = useHistory();

    const [relation, setRelation] = React.useState<any>(null);

    const [showStopRaceConfirmModal, setShowStopRaceConfirmModal] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const showRegisterModalOrRedirect = (competitionUnit: CompetitionUnit) => {
        if (isAuthenticated) {
            setCompetitionUnit(competitionUnit);
            setShowRegisterModal(true);
        } else {
            history.push('/signin');
        }
    }

    const openStopRaceConfirmModal = (competitionUnit: CompetitionUnit) => {
        setCompetitionUnit(competitionUnit);
        setShowStopRaceConfirmModal(true);
    }

    const canDeleteRace = () => {
        return [RaceStatus.SCHEDULED].includes(race.status);
    }

    React.useEffect(() => {
        if (relations.length > 0) {
            setRelation(relations.find(r => r.id === race.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [relations]);

    const canRegisterToRace = () => { // race is scheduled and event is open and allow for registration and event status is on going or scheduled and the user is not admin.
        const isNotAdminOrParticipant = relation && !relation.isAdmin && !relation.isParticipating;
        const eventIsRegattaAndOngoingOrScheduled = event.isOpen && event.allowRegistration && [EventState.ON_GOING, EventState.SCHEDULED].includes(event.status!);
        const isNotEventEditor = !event.isEditor;
        const raceIsScheduled = [RaceStatus.SCHEDULED].includes(race.status!);

        return isNotAdminOrParticipant && eventIsRegattaAndOngoingOrScheduled && isNotEventEditor && raceIsScheduled;
    }

    const canStopRace = () => {
        const isAdmin = relation?.isAdmin;
        const isRaceOnGoing = [RaceStatus.ON_GOING].includes(race.status!);

        return isAdmin && isRaceOnGoing;
    }

    return (<Space size="middle">
        <StopRaceConfirmModal reloadParent={reloadParent} race={race} showModal={showStopRaceConfirmModal} setShowModal={setShowStopRaceConfirmModal} />
        <RegisterRaceModal
            showModal={showRegisterModal}
            setShowModal={setShowRegisterModal}
            raceName={race.name}
            lon={event.lon}
            lat={event.lat}
            setRelation={setRelation}
            raceId={race.id}
            eventId={race.calendarEventId}
        />
        {canRegisterToRace() && <CreateButton icon={<FiEdit style={{ marginRight: '10px' }} />} onClick={() => showRegisterModalOrRedirect(race)}>{t(translations.home_page.register_as_competitor)}</CreateButton>}
        {canStopRace() && <CreateButton onClick={() => openStopRaceConfirmModal(race)}>{t(translations.competition_unit_list_page.stop)}</CreateButton>}
        {canManageEvent() && <>
            <Tooltip title={t(translations.tip.update_race)}>
                <BorderedButton onClick={() => {
                    history.push(`/events/${race.calendarEventId}/races/${race.id}/update`);
                }} type="primary">{t(translations.general.update)}</BorderedButton>
            </Tooltip>

            { canDeleteRace() && <Tooltip title={t(translations.tip.delete_race)}>
                <BorderedButton danger onClick={() => showDeleteRaceModal(race)}>{t(translations.general.delete)}</BorderedButton>
            </Tooltip>}
        </>}
    </Space>)
}