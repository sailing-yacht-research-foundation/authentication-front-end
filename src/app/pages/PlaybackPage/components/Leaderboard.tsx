import React, { useState } from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { RaceEmitterEvent } from "utils/constants";
import { Tooltip } from "antd";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";

export const Leaderboard = ({ participantsData = [], emitter }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { t } = useTranslation();

    const handleIsOpenChange = () => {
        setIsOpen(!isOpen);
    };

    const cpyParticipantsData = [...participantsData];
    const sortedParticipantsByLeaderboard = !!cpyParticipantsData.length
        ? cpyParticipantsData.sort((a: any, b: any): number => {
            return a?.leaderPosition - b?.leaderPosition;
        })
        : [];

    if (participantsData?.length <= 1) return null;

    const zoomToParticipant = (participant) => {
        emitter?.emit(RaceEmitterEvent.ZOOM_TO_PARTICIPANT, participant);
    }

    return (
        <Wrapper>
            <HeaderContainer onClick={handleIsOpenChange}>
                <p style={{ marginBottom: "0px", fontSize: '12px' }}>
                    <strong>{t(translations.playback_page.leaderboard)}</strong>
                </p>

                <CaretDownOutlined
                    style={{ transition: "all 0.3s", transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
                />
            </HeaderContainer>

            <ContentContainer style={{ maxHeight: isOpen ? "350px" : "0px", overflow: isOpen ? "auto" : "hidden" }}>
                {!participantsData.length && <div style={{ marginTop: "8px", color: "#AAAAAA" }}>{t(translations.playback_page.no_participant)}</div>}
                {!!participantsData.length && (
                    <div>
                        {sortedParticipantsByLeaderboard.map((participant: any) => {
                            return (
                                <Tooltip title={t(translations.tip.click_to_move_to_participant_name, { participantName: participant?.participant?.competitor_name })}>
                                    <div onClick={() => zoomToParticipant(participant)} key={participant.id} style={{ margin: "8px 0px", cursor: 'pointer' }}>
                                        <div style={{ borderBottom: `2px solid ${participant?.color}` }}>
                                            <p style={{ marginBottom: "0px" }}>
                                                {participant?.participant?.competitor_name}
                                            </p>
                                        </div>
                                    </div>
                                </Tooltip>
                            );
                        })}
                    </div>
                )}
            </ContentContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    padding: 8px 16px;
    border-radius: 8px;
    background-color: #fff;
    width: 100%;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
`;

const ContentContainer = styled.div`
    overflow: hidden;
`;
