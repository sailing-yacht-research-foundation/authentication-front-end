import React from 'react';
import { BorderedButton, IconWrapper } from 'app/components/SyrfGeneral';
import { FaRobot } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { selectPlaybackType, selectCompetitionUnitDetail } from "./slice/selectors";
import { simulateRace } from 'services/live-data-server/competition-units';
import { PlaybackTypes } from 'types/Playback';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { translations } from 'locales/translations';
import { useTranslation, Trans } from 'react-i18next';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import styled from 'styled-components';
import { media } from 'styles/media';

export const SimulateRaceButton = () => {

    const { t } = useTranslation();

    const [creatingSimulate, setIsCreatingSimulate] = React.useState<boolean>(false);

    const [showRaceIsSimulatedModal, setShowRaceIsSimulatedModal] = React.useState<boolean>(false);

    const [simulatedRaceDetail, setSimulatedRaceDetail] = React.useState<any>({});

    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);

    const authUser = useSelector(selectUser);

    const playbackType = useSelector(selectPlaybackType);

    const performSimulateRace = async () => {
        setIsCreatingSimulate(true);
        const response = await simulateRace(competitionUnitDetail.id);
        setIsCreatingSimulate(false);

        if (response.success) {
            setShowRaceIsSimulatedModal(true);
            setSimulatedRaceDetail(response.data);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const hideModal = () => {
        setShowRaceIsSimulatedModal(false);
    }

    if (playbackType === PlaybackTypes.OLDRACE && authUser.developerAccountId)
        return (
            <>
                <Modal
                    cancelButtonProps={{ style: { display: 'none' } }}
                    onOk={hideModal}
                    onCancel={hideModal}
                    visible={showRaceIsSimulatedModal}
                    title={t(translations.playback_page.simulate_success)}>
                    <h3>{t(translations.playback_page.the_simulation_for_this_race_has_been_running)}</h3>
                    <span><Trans key={translations.playback_page.simulate_link}>You can <Link to={`/playback?raceId=${simulatedRaceDetail?.competitionUnit?.id}`}>view it</Link> on the playback or check out the event <Link to={`/events/${simulatedRaceDetail?.event?.id}`}>here</Link>.</Trans></span>
                </Modal>
                <StyledSimulateRaceButton onClick={performSimulateRace} loading={creatingSimulate} icon={
                    <IconWrapper>
                        <FaRobot />
                    </IconWrapper>} type="primary">
                    {t(translations.playback_page.simulate)}
                </StyledSimulateRaceButton>
            </>
        );

    return <></>;
}

const StyledSimulateRaceButton = styled(BorderedButton)`
    display: none;

    ${media.medium`
        display: block;
    `};
`;