import React, { useState } from "react";
import { Button, Modal } from "antd";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCompetitionUnitDetail } from "./slice/selectors";
import { RaceStatus } from "utils/constants";
import { RaceStatusModalWrapper } from "app/components/SyrfGeneral";

export const ModalRaceCompleted = () => {

    const { t } = useTranslation();

    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);

    const [showModal, setShowModal] = useState<boolean>(false);

    React.useEffect(() => {
        if ([RaceStatus.COMPLETED].includes(competitionUnitDetail.status)) {
            setShowModal(true);
        }
    } ,[competitionUnitDetail.status]);

    return (
        <div style={{ zIndex: 999}}>
            <Modal visible={showModal} footer={null} closable={true} onCancel={()=> setShowModal(false)}>
                <RaceStatusModalWrapper>
                    <h3>{t(translations.playback_page.race_is_completed)}</h3>
                    <span>{t(translations.playback_page.this_race_is_completed)}</span>
                    <br />
                    <Button onClick={() => window.location.reload()} type="link">{t(translations.playback_page.click_here_for_replay)}</Button>
                </RaceStatusModalWrapper>
            </Modal>
        </div>
    );
};
