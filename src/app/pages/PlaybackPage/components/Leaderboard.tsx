import React, { useState } from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import styled from "styled-components";

export const Leaderboard = ({ participantsData = [] }) => {
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

    return (
        <Wrapper>
            <HeaderContainer onClick={handleIsOpenChange}>
                <p style={{ marginBottom: "0px" }}>
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
                                <div key={participant.id} style={{ margin: "8px 0px" }}>
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
