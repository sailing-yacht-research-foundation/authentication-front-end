import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import React from 'react';
import { BiUserPlus } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { getRequestedFollowRequests } from 'services/live-data-server/profile';
import styled from 'styled-components';
import { media } from 'styles/media';
import { FollowRequestModal } from './FollowRequestModal';

export const FollowRequest = () => {
    const [numberOfRequests, setNumberOfRequests] = React.useState<number>(0);

    const user = useSelector(selectUser);

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const getFollowRequests = async () => {
        const response = await getRequestedFollowRequests(1);

        if (response.success) {
            setNumberOfRequests(response?.data?.count);
        }
    }

    React.useEffect(() => {
        if (user) {
            getFollowRequests();
        }
    }, [user]);

    return (
        <>
            {numberOfRequests > 0 && <Wrapper>
                <FollowRequestModal reloadFollowRequestsCount={() => getFollowRequests()} showModal={showModal} setShowModal={setShowModal} />
                <StyledPendingApproveFollowerButton onClick={() => setShowModal(true)} />
                <NumberOfRequests>{numberOfRequests}</NumberOfRequests>
            </Wrapper>}
        </>
    );
}

const Wrapper = styled.div`
    position: relative;
    cursor: pointer;
    height: 25px;
`;

const NumberOfRequests = styled.div`
    position: absolute;
    right: 0px;
    background: #DC6E1E;
    padding: 2px 3px;
    font-size: 10px;
    top: 10px;
    border-radius: 5px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
`;

const StyledPendingApproveFollowerButton = styled(BiUserPlus)`
    font-size: 25px;
    color: #40a9ff;
    margin-right: 20px;

    ${media.medium`
        margin-right: 15px;
    `}
`;