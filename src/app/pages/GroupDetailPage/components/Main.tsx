import React from 'react';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import { LeftPane } from './LeftPane';
import { Nav } from './Nav';
import { Members } from './Members';
import { Spin } from 'antd';
import { media } from 'styles/media';
import { useDispatch, useSelector } from 'react-redux';
import { useGroupDetailSlice } from '../slice';
import { selectGetGroupFailed, selectGroupDetail, selectIsGettingGroup } from '../slice/selectors';
import { OrganizationStripeNotSetupAlert } from './OrganizationStripeNotSetupAlert';
import { useLocation } from 'react-router-dom';
import { GroupOrganizationConnect } from './GroupOrganizationConnect';

export const Main = () => {
    const group = useSelector(selectGroupDetail);

    const isLoading = useSelector(selectIsGettingGroup);

    const getgroupFailed = useSelector(selectGetGroupFailed);

    const { groupId } = useParams<{ groupId: string }>();

    const history = useHistory();

    const dispatch = useDispatch();

    const location = useLocation();

    const { actions } = useGroupDetailSlice();

    React.useEffect(() => {
        if (getgroupFailed) {
            history.push('/groups');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getgroupFailed]);

    React.useEffect(() => {
        dispatch(actions.getGroup(groupId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupId]);

    React.useEffect(() => {
        return () => {
            dispatch(actions.clearGroupData());

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isOrganizationConnectRoute = location.pathname.includes('organization-connect');

    return (
        <Wrapper>
            <Spin spinning={isLoading}>
                <Nav group={group} />
                <OrganizationStripeNotSetupAlert group={group} />
                <Container>
                    <LeftPane group={group} />
                    {isOrganizationConnectRoute ? <GroupOrganizationConnect group={group} /> : <Members group={group} />}
                </Container>
            </Spin>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    max-width: 100%;
    margin: 0 auto;
    padding: 10px;

    ${media.medium`
        padding: 30px 15px 0 15px;
        max-width: 80%;
    `}
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;

    ${media.medium`
        flex-direction: row;
    `}
`;