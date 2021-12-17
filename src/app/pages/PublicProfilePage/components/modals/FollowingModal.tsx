import React from 'react';
import { Modal, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../../slice';
import { selectFollowing, selectFollowingCurrentPage, selectFollowingTotalPage } from '../../slice/selectors';
import { UserFollowerFollowingRow } from 'app/components/UserFollowerFollowingRow';
import InfiniteScroll from 'react-infinite-scroller';

export const FollowingModal = ({ profileId, showModal, setShowModal }) => {

    const followings = useSelector(selectFollowing);

    const dispatch = useDispatch();

    const { actions } = usePublicProfileSlice();

    const followingCurrentPage = useSelector(selectFollowingCurrentPage);

    const followingTotalPage = useSelector(selectFollowingTotalPage);

    const renderFollowers = () => {
        return followings.map(following => {
            return <UserFollowerFollowingRow profileId={following.followingId} profile={following} />
        })
    }

    const getFollowing = (page) => {
        dispatch(actions.getFollowing({ page: page, profileId }));
    }

    React.useEffect(() => {
        dispatch(actions.getFollowing({ page: 1, profileId }));
    }, [profileId]);

    return (
        <Modal
            visible={showModal}
            onCancel={() => setShowModal(false)}
            title={'Following'}
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ style: { display: 'none' } }}>
            <InfiniteScroll
                pageStart={1}
                loadMore={getFollowing}
                hasMore={followingCurrentPage < followingTotalPage}
                loader={<Spin spinning={true}></Spin>}>

                {renderFollowers()}
            </InfiniteScroll>
        </Modal >
    )
}