import React from "react";
import { Button, Modal } from "antd";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCompetitionUnitDetail } from "./slice/selectors";
import { RaceStatus } from "utils/constants";
import { handleGoBack } from "utils/helpers";
import { useHistory } from "react-router-dom";
import { RaceStatusModalWrapper } from "app/components/SyrfGeneral";

export const ModalRaceCanceled = () => {

    const { t } = useTranslation();

    const history = useHistory();

    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);

    return (
        <div>
            <Modal visible={[RaceStatus.CANCELED].includes(competitionUnitDetail.status)} footer={null} closable={false}>
                <RaceStatusModalWrapper>
                    <h3>{t(translations.playback_page.race_is_canceled)}</h3>
                    <span>{t(translations.playback_page.this_race_is_canceled_by_the_organizer)}</span>
                    <br />
                    <Button onClick={() => handleGoBack(history)} type="link">{t(translations.playback_page.go_back)}</Button>
                </RaceStatusModalWrapper>
            </Modal>
        </div>
    );
};
