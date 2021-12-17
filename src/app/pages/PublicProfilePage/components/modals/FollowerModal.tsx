import React from 'react';
import { Modal, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../../slice';
import { selectFollowerCurrentPage, selectFollowers, selectFollowerTotalPage } from '../../slice/selectors';
import { UserFollowerFollowingRow } from 'app/components/UserFollowerFollowingRow';
import InfiniteScroll from 'react-infinite-scroller';
import { SpinLoadMoreContainer } from 'app/components/SyrfGeneral';

export const FollowerModal = ({ profileId, showModal, setShowModal }) => {

    const followers = useSelector(selectFollowers);

    const dispatch = useDispatch();

    const { actions } = usePublicProfileSlice();

    const followerTotalPage = useSelector(selectFollowerTotalPage);

    const followerCurrentPage = useSelector(selectFollowerCurrentPage);

    const renderFollowers = () => {
        return followers.map(follower => {
            return <UserFollowerFollowingRow profile={follower} profileId={follower.followerId} />
        })
    }

    const getFollowers = (page) => {
        dispatch(actions.getFollowers({ page: page, profileId }));
    }

    React.useEffect(() => {
        dispatch(actions.getFollowers({ page: 1, profileId }))
    }, [profileId]);

    return (
        <Modal
            visible={showModal}
            onCancel={() => setShowModal(false)}
            title={'Followers'}
            footer={null}
            >
            <InfiniteScroll
                pageStart={1}
                loadMore={getFollowers}
                hasMore={followerCurrentPage < followerTotalPage}
                loader={<SpinLoadMoreContainer><Spin spinning={true}></Spin></SpinLoadMoreContainer>}>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {renderFollowers()}
                </div>
            </InfiniteScroll>
        </Modal >
    )
}