import React from "react";
import { Modal } from "antd";
import { translations } from "locales/translations";
import { RaceStatusModalWrapper } from "app/components/SyrfGeneral";
import { useDispatch, useSelector } from "react-redux";
import { selectCompetitionUnitDetail, selectPlaybackType } from "./slice/selectors";
import { RaceSource, RaceStatus } from "utils/constants";
import { useTranslation } from "react-i18next";
import { usePlaybackSlice } from "./slice";
import { PlaybackTypes } from "types/Playback";
let reloadInterval;
const reloadEvery = 30000; // ms

export const ModalDataIsBeingProcessed = () => {

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);

    const dispatch = useDispatch();

    const { actions } = usePlaybackSlice();

    const { t } = useTranslation();

    const playbackType = useSelector(selectPlaybackType);

    React.useEffect(() => {
        if (competitionUnitDetail.calendarEvent?.source === RaceSource.SYRF
            && competitionUnitDetail.status === RaceStatus.COMPLETED) {
            if (!competitionUnitDetail.isSavedByEngine) {
                dispatch(actions.setPlaybackType(PlaybackTypes.RACELOADING));
                setShowModal(true);
                clearIntervalIfNecessary();
                reloadInterval = setInterval(() => {
                    dispatch(actions.setPlaybackType(PlaybackTypes.RACELOADING));
                    dispatch(actions.getCompetitionUnitDetail({ id: competitionUnitDetail.id }));
                }, reloadEvery);
            } else {
                if (playbackType !== PlaybackTypes.OLDRACE) {
                    dispatch(actions.setPlaybackType(PlaybackTypes.OLDRACE));
                }

                clearIntervalIfNecessary();
                setShowModal(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [competitionUnitDetail.source, competitionUnitDetail.isSavedByEngine]);

    const clearIntervalIfNecessary = () => {
        if (reloadInterval) {
            clearInterval(reloadInterval);
        }
    }

    return (
        <div style={{ zIndex: 999 }}>
            <Modal visible={showModal} footer={null} closable={false}>
                <RaceStatusModalWrapper>
                    <h3>{t(translations.playback_page.we_are_processing_data)}</h3>
                    <span>{t(translations.playback_page.it_will_take_some_time_to_process_this_race)}</span>
                </RaceStatusModalWrapper>
            </Modal>
        </div>
    );
}
