import React from 'react';
import styled from 'styled-components';
import { InvitationItemRow } from './InvitationItem';
import { useDispatch, useSelector } from 'react-redux';
import { selectInvitations, selectInvitationTotalPage } from '../slice/selectors';
import { useGroupSlice } from '../slice';

export const GroupInvitationList = () => {

    const invitations = useSelector(selectInvitations);

    const invitationTotal = useSelector(selectInvitationTotalPage);

    const dispatch = useDispatch();

    const { actions } = useGroupSlice();

    const renderInvitationItem = () => {
        if (invitations.length > 0)
            return invitations.map(invitation => <InvitationItemRow invitation={invitation} />);
        return <EmptyInvitationMessage>You don't have any invitation right now.</EmptyInvitationMessage>
    }

    React.useEffect(() => {
        dispatch(actions.getGroupInvitations({ page: 1, invitationType: 'INVITED' }));
    }, []);

    return (
        <Wrapper>
            <TitleContainer>
                <Title>Invitations</Title>
                {invitationTotal > 10 && <SeeAll>See All</SeeAll>}
            </TitleContainer>
            <InvitationList>
                {renderInvitationItem()}
            </InvitationList>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    border-radius: 5px;
    padding: 15px;
    background: #fff;
    width: 100%;
    border: 1px solid #eee;
`;

const Title = styled.h3``;

const InvitationList = styled.div``;

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const SeeAll = styled.a`
    
`;

const EmptyInvitationMessage = styled.span`

`;