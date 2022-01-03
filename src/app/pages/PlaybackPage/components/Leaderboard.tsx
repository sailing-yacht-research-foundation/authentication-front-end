import React, { useState } from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { RaceEmitterEvent } from "utils/constants";
import ReactTooltip from "react-tooltip";

export const Leaderboard = ({ participantsData = [], emitter }) => {
    const [isOpen, setIsOpen] = useState(false);

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
                <p style={{ marginBottom: "0px", fontSize:'12px' }}>
                    <strong>Leader board</strong>
                </p>

                <CaretDownOutlined
                    style={{ transition: "all 0.3s", transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
                />
            </HeaderContainer>

            <ContentContainer style={{ maxHeight: isOpen ? "350px" : "0px", overflow: isOpen ? "auto" : "hidden" }}>
                {!participantsData.length && <div style={{ marginTop: "8px", color: "#AAAAAA" }}>No participant</div>}
                {!!participantsData.length && (
                    <div>
                        {sortedParticipantsByLeaderboard.map((participant: any) => {
                            return (
                                <div data-tip={`Click to move to ${participant?.participant?.competitor_name} location`} onClick={() => zoomToParticipant(participant)} key={participant.id} style={{ margin: "8px 0px", cursor: 'pointer' }}>
                                    <div style={{ borderBottom: `2px solid ${participant?.color}` }}>
                                        <p style={{ marginBottom: "0px" }}>
                                            {participant?.participant?.competitor_name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ContentContainer>
            <ReactTooltip/>
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
