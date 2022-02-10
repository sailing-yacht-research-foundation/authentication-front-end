import React from 'react';
import { Space } from 'antd';
import { BorderedButton, CreateButton } from 'app/components/SyrfGeneral';
import { EventState, RaceStatus } from 'utils/constants';
import { FiEdit } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import { RegisterRaceModal } from 'app/components/RegisterRaceModal';

export const RaceManageButtons = (props) => {
    const { race, canManageEvent, event, setCompetitionUnit, showRegisterModal, setShowRegisterModal, isAuthenticated, showDeleteRaceModal, relations } = props;

    const history = useHistory();

    const [relation, setRelation] = React.useState<any>(null);

    const { t } = useTranslation();

    const showRegiterModalOrRedirect = (competitionUnit) => {
        if (isAuthenticated) {
            setCompetitionUnit(competitionUnit);
            setShowRegisterModal(true);
        } else {
            history.push('/signin');
        }
    }

    React.useEffect(() => {
        if (relations.length > 0) {
            setRelation(relations.find(r => r.id === race.id));
        }
    }, [relations]);

    const canRegisterToRace = () => { // race is scheduled and event is open and allow for registration and event status is on going or scheduled and the user is not admin.
        return relation && !relation?.isAdmin && !relation?.isParticipating && [RaceStatus.SCHEDULED].includes(race.status) && event.isOpen
            && event.allowRegistration && [EventState.ON_GOING, EventState.SCHEDULED].includes(event.status) && !event.isEditor;
    }

    return (<Space size="middle">
        <RegisterRaceModal
            showModal={showRegisterModal}
            setShowModal={setShowRegisterModal}
            raceName={race.name}
            lon={event.lon}
            lat={event.lat}
            setRelation={setRelation}
            raceId={race.id}
        />
        {canRegisterToRace() && <CreateButton icon={<FiEdit style={{ marginRight: '10px' }} />} onClick={() => showRegiterModalOrRedirect(race)}>{t(translations.home_page.register_as_competitor)}</CreateButton>}
        {canManageEvent() && <>
            <BorderedButton data-tip={t(translations.tip.update_race)} onClick={() => {
                history.push(`/events/${race.calendarEventId}/races/${race.id}/update`);
            }} type="primary">{t(translations.competition_unit_list_page.update)}</BorderedButton>
            <BorderedButton data-tip={t(translations.tip.delete_race)} danger onClick={() => showDeleteRaceModal(race)}>{t(translations.competition_unit_list_page.delete)}</BorderedButton></>}
        <ReactTooltip />
    </Space>)
}