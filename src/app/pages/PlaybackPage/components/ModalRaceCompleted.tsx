import React from "react";
import { Button, Modal } from "antd";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCompetitionUnitDetail } from "./slice/selectors";
import { RaceStatus } from "utils/constants";

export const ModalRaceCompleted = () => {

    const { t } = useTranslation();

    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);

    return (
        <div>
            <Modal visible={[RaceStatus.COMPLETED, RaceStatus.CANCELED].includes(competitionUnitDetail.status)} footer={null} closable={false}>
                <p style={{ fontSize: "16px", marginBottom: "0px", textAlign: "center" }}>
                    <h3>{t(translations.playback_page.race_is_completed)}</h3>
                    <span>{t(translations.playback_page.this_race_is_completed)}</span>
                    <br />
                    <Button onClick={() => window.location.reload()} type="link">{t(translations.playback_page.click_here_for_replay)}</Button>
                </p>
            </Modal>
        </div>
    );
};