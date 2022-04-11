import React from 'react';
import { AiFillHeart, AiFillStar } from 'react-icons/ai';
import { FaHandsWash } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { IoThumbsUp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { sendKudos } from 'services/live-data-server/competition-units';
import styled from 'styled-components';
import { KudoTypes } from 'utils/constants';
import { selectCompetitionUnitDetail, selectVesselParticipantDataForShowingKudos } from './slice/selectors';
import { message } from 'antd';
import { usePlaybackSlice } from './slice';

export const KudosReaction = () => {

    const { participant, id } = useSelector(selectVesselParticipantDataForShowingKudos);

    const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);

    const dispatch = useDispatch();

    const { actions } = usePlaybackSlice();

    const competitorName = participant?.competitor_name;

    const sendKudosToParticipant = async (kudosType: KudoTypes) => {
        const response = await sendKudos(competitionUnitDetail.id, kudosType, id);

        if (response.success) {
            message.success(`Sucessfully send kudos to ${competitorName}`);
        }

        closeKudosReactionPanel();
    }

    const closeKudosReactionPanel = () => {
        dispatch(actions.setVesselParticipantIdForShowingKudos({}));
    }

    return (<>
        {
            id && <KudoContainer>
                <KudosReactionItem>
                    <KudosReactionItemInner onClick={() => sendKudosToParticipant(KudoTypes.THUMBS_UP)} className='like' data-tip={`Send Like to ${competitorName}`}>
                        <IoThumbsUp />
                    </KudosReactionItemInner>
                </KudosReactionItem>
                <KudosReactionItem>
                    <KudosReactionItemInner onClick={() => sendKudosToParticipant(KudoTypes.APPLAUSE)} className='applause' data-tip={`Send Applause to ${competitorName}`}>
                        <FaHandsWash />
                    </KudosReactionItemInner>
                </KudosReactionItem>
                <KudosReactionItem>
                    <KudosReactionItemInner onClick={() => sendKudosToParticipant(KudoTypes.HEART)} className='heart' data-tip={`Send Heart to ${competitorName}`}>
                        <AiFillHeart />
                    </KudosReactionItemInner>
                </KudosReactionItem>
                <KudosReactionItem>
                    <KudosReactionItemInner onClick={() => sendKudosToParticipant(KudoTypes.STAR)} className='star' data-tip={`Send Star to ${competitorName}`}>
                        <AiFillStar />
                    </KudosReactionItemInner>
                </KudosReactionItem>
                <KudosReactionItem>
                    <KudosReactionItemInner onClick={closeKudosReactionPanel} className='close' data-tip='Close'>
                        <IoMdClose />
                    </KudosReactionItemInner>
                </KudosReactionItem>
                <ReactTooltip />
            </KudoContainer>
        }
    </>);
}

const KudoContainer = styled.div`
    z-index: 1000;
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    bottom: 120px;
    background: #fff;
    display: flex;
    padding: 5px;
    border-radius: 30px;
    box-shadow: 0 12px 28px 0 rgba(0,0,0,0.2),0 2px 4px 0 rgba(0,0,0,0.1),inset 0 0 0 1px rgba(255,255,255,0.5);
`;

const KudosReactionItem = styled.div`
    font-size: 30px;
    margin: 0 5px;
`;

const KudosReactionItemInner = styled.div`
    padding: 15px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display:flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    transition: transform .2s;

    :hover {
        transform:  scale(1.2);
    }

    &.like {
        background-color: #2980b9;
    }
    &.heart {
        background-color: #e74c3c;
    }
    &.applause {
        background-color: #9b59b6;
    }
    &.star {
        background-color: #f1c40f;
    }
    &.close {
        color: unset;
        border: 1px solid #606060;
    }
`;