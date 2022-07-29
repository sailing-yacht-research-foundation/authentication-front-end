import React, { useState } from "react";
import { Modal } from "antd";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectCompetitionUnitDetail } from "./slice/selectors";
import { RaceStatus } from "utils/constants";
import { RaceStatusModalWrapper } from "app/components/SyrfGeneral";
import { usePlaybackSlice } from "./slice";
import { PlaybackTypes } from "types/Playback";

export const ModalRaceCompleted = () => {

    const { t } = useTranslation();

    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);

    const [showModal, setShowModal] = useState<boolean>(false);

    const dispatch = useDispatch();

    const { actions } = usePlaybackSlice();

    React.useEffect(() => {
        if ([RaceStatus.COMPLETED].includes(competitionUnitDetail.status)) {
            setShowModal(true);
        }
    } ,[competitionUnitDetail.status]);

    const hideModal = () => {
        dispatch(actions.setPlaybackType(PlaybackTypes.OLDRACE));
        setShowModal(false);
    }

    return (
        <div style={{ zIndex: 999}}>
            <Modal visible={showModal} footer={null} closable={true} onCancel={hideModal}>
                <RaceStatusModalWrapper>
                    <h3>{t(translations.playback_page.race_is_completed)}</h3>
                    <span>{t(translations.playback_page.this_race_is_completed)}</span>
                </RaceStatusModalWrapper>
            </Modal>
        </div>
    );
};
