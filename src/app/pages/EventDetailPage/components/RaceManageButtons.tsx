import React from 'react';
import { Space, Tooltip } from 'antd';
import { BorderedButton, CreateButton } from 'app/components/SyrfGeneral';
import { RaceStatus } from 'utils/constants';
import { useHistory } from 'react-router-dom';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { CompetitionUnit } from 'types/CompetitionUnit';
import { CalendarEvent } from 'types/CalendarEvent';
import { StopRaceConfirmModal } from 'app/pages/MyEventCreateUpdatePage/components/modals/StopRaceConfirmModal';
import { EditFilled } from '@ant-design/icons';
import { FaTrash } from 'react-icons/fa';
import { canManageEvent } from 'utils/permission-helpers';

interface IRaceManageButtons {
    race: CompetitionUnit,
    event: CalendarEvent,
    setCompetitionUnit: Function,
    showDeleteRaceModal: Function,
    reloadParent?: Function
}

export const RaceManageButtons = (props: IRaceManageButtons) => {
    const { race, reloadParent, event, setCompetitionUnit, showDeleteRaceModal } = props;

    const history = useHistory();

    const [showStopRaceConfirmModal, setShowStopRaceConfirmModal] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const openStopRaceConfirmModal = (competitionUnit: CompetitionUnit) => {
        setCompetitionUnit(competitionUnit);
        setShowStopRaceConfirmModal(true);
    }

    const canDeleteRace = () => {
        return [RaceStatus.SCHEDULED].includes(race.status);
    }

    const canStopRace = () => {
        const isAdmin = event.isEditor;
        const isRaceOnGoing = [RaceStatus.ON_GOING].includes(race.status!);

        return isAdmin && isRaceOnGoing;
    }

    return (<Space size="middle">
        <StopRaceConfirmModal reloadParent={reloadParent} race={race} showModal={showStopRaceConfirmModal} setShowModal={setShowStopRaceConfirmModal} />
        {canStopRace() && <CreateButton onClick={() => openStopRaceConfirmModal(race)}>{t(translations.general.stop)}</CreateButton>}
        {canManageEvent(event) && <>
            <Tooltip title={t(translations.tip.update_race)}>
                <BorderedButton icon={<EditFilled />} onClick={() => {
                    history.push(`/events/${race.calendarEventId}/races/${race.id}/update`);
                }} type="primary" />
            </Tooltip>

            {canDeleteRace() && <Tooltip title={t(translations.tip.delete_race)}>
                <BorderedButton danger icon={<FaTrash />} onClick={() => showDeleteRaceModal(race)} />
            </Tooltip>}
        </>}
    </Space>)
}
