import React from 'react';
import { Modal, Spin, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../../slice';
import { selectFollowerCurrentPage, selectFollowerPageSize, selectFollowers, selectFollowerTotalRecords, selectModalLoading } from '../../slice/selectors';
import { UserFollowerFollowingRow } from 'app/components/SocialProfile/UserFollowerFollowingRow';
import { PaginationContainer } from 'app/pages/GroupDetailPage/components/Members';
import { DEFAULT_PAGE_SIZE } from 'utils/constants';

export const FollowerModal = ({ profileId, showModal, setShowModal, reloadParent }) => {

    const followers = useSelector(selectFollowers);

    const dispatch = useDispatch();

    const { actions } = usePublicProfileSlice();

    const followerCurrentPage = useSelector(selectFollowerCurrentPage);

    const followerTotalRecords = useSelector(selectFollowerTotalRecords);

    const followerPageSize = useSelector(selectFollowerPageSize);

    const isLoading = useSelector(selectModalLoading);

    const [performedAction, setPerformedAction] = React.useState<boolean>(false);

    const renderFollowers = () => {
        return followers.map(follower => {
            return <UserFollowerFollowingRow key={follower.followerId} setPerformedAction={setPerformedAction} profile={follower} profileId={follower.followerId} />
        })
    }

    const getFollowers = (page, size) => {
        dispatch(actions.getFollowers({ page: page, size: size, profileId }));
    }

    const hideModal = () => {
        setShowModal(false);
        if (performedAction) {
            reloadParent();
        }
    }

    React.useEffect(() => {
        if (showModal)
            dispatch(actions.getFollowers({ page: 1, size: 10, profileId }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId, showModal]);

    return (
        <Modal
            visible={showModal}
            onCancel={hideModal}
            title={'Followers'}
            footer={null}
        >
            <Spin spinning={isLoading}>
                {renderFollowers()}
                {followerTotalRecords > DEFAULT_PAGE_SIZE && <PaginationContainer>
                    <Pagination
                        current={followerCurrentPage}
                        onChange={(page, size) => getFollowers(page, size)}
                        pageSize={followerPageSize}
                        total={followerTotalRecords} />
                </PaginationContainer>}
            </Spin>
        </Modal >
    )
}