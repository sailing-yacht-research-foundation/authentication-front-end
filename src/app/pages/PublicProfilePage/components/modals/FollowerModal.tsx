import React from 'react';
import { Modal, Spin, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../../slice';
import { selectFollowerCurrentPage, selectFollowers, selectFollowerTotalRecords, selectModalLoading } from '../../slice/selectors';
import { UserFollowerFollowingRow } from 'app/components/SocialProfile/UserFollowerFollowingRow';
import { PaginationContainer } from 'app/pages/GroupDetailPage/components/Members';

export const FollowerModal = ({ profileId, showModal, setShowModal, reloadParent }) => {

    const followers = useSelector(selectFollowers);

    const dispatch = useDispatch();

    const { actions } = usePublicProfileSlice();

    const followerCurrentPage = useSelector(selectFollowerCurrentPage);

    const followerTotalRecords = useSelector(selectFollowerTotalRecords);

    const isLoading = useSelector(selectModalLoading);

    const [performedAction, setPerformedAction] = React.useState<boolean>(false);

    const renderFollowers = () => {
        return followers.map(follower => {
            return <UserFollowerFollowingRow setPerformedAction={setPerformedAction} profile={follower} profileId={follower.followerId} />
        })
    }

    const getFollowers = (page) => {
        dispatch(actions.getFollowers({ page: page, profileId }));
    }

    const hideModal = () => {
        setShowModal(false);
        if (performedAction) {
            reloadParent();
        }
    }

    React.useEffect(() => {
        dispatch(actions.getFollowers({ page: 1, profileId }))
    }, [profileId]);

    return (
        <Modal
            visible={showModal}
            onCancel={hideModal}
            title={'Followers'}
            footer={null}
        >
            <Spin spinning={isLoading}>
                {renderFollowers()}
                {followerTotalRecords > 10 && <PaginationContainer>
                    <Pagination current={followerCurrentPage} onChange={(page) => getFollowers(page)} total={followerTotalRecords} />
                </PaginationContainer>}
            </Spin>
        </Modal >
    )
}