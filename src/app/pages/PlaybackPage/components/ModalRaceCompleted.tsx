import React from "react";
import { Button, Modal } from "antd";
import { translations } from "locales/translations";
import { handleGoBack } from "utils/helpers";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCompetitionUnitDetail } from "./slice/selectors";
import { RaceStatus } from "utils/constants";

export const ModalRaceCompleted = () => {

    const history = useHistory();

    const { t } = useTranslation();

    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);

    return (
        <div>
            <Modal visible={[RaceStatus.COMPLETED, RaceStatus.CANCELED].includes(competitionUnitDetail.status)} footer={null} closable={false}>
                <p style={{ fontSize: "16px", marginBottom: "0px", textAlign: "center" }}>
                    <h3>{t(translations.playback_page.race_is_completed)}</h3>
                    <span>{t(translations.playback_page.this_race_is_completed)}</span>
                    <br />
                    <Button onClick={() => handleGoBack(history)} type="link">{t(translations.playback_page.go_back)}</Button>
                </p>
            </Modal>
        </div>
    );
};