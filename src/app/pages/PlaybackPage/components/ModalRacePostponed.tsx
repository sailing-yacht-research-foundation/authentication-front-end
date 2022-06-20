import React from "react";
import { Button, Modal } from "antd";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCompetitionUnitDetail } from "./slice/selectors";
import moment from "moment";
import { handleGoBack } from "utils/helpers";
import { useHistory } from "react-router-dom";

export const ModalRacePostponed = () => {

    const { t } = useTranslation();

    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);

    const canShowModal = !moment(competitionUnitDetail.startTime).isValid();
    
    const history = useHistory();

    return (
        <div>
            <Modal visible={canShowModal} footer={null} closable={false}>
                <p style={{ fontSize: "16px", marginBottom: "0px", textAlign: "center" }}>
                    <h3>{t(translations.playback_page.race_is_postponed)}</h3>
                    <span>{t(translations.playback_page.this_race_is_postponed_please_check_with_event_creator)}</span>
                    <br />
                    <Button onClick={() => handleGoBack(history)} type="link">{t(translations.playback_page.go_back)}</Button>
                </p>
            </Modal>
        </div>
    );
};