import React from 'react';
import { Modal, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../../slice';
import { selectFollowerCurrentPage, selectFollowers, selectFollowerTotalPage, selectFollowerTotalRecords } from '../../slice/selectors';
import { UserFollowerFollowingRow } from 'app/components/UserFollowerFollowingRow';
import InfiniteScroll from 'react-infinite-scroller';

export const FollowerModal = ({ profileId, showModal, setShowModal }) => {

    const followers = useSelector(selectFollowers);

    const dispatch = useDispatch();

    const { actions } = usePublicProfileSlice();

    const followerTotalPage = useSelector(selectFollowerTotalPage);

    const followerCurrentPage = useSelector(selectFollowerCurrentPage);

    const renderFollowers = () => {
        return followers.map(follower => {
            return <UserFollowerFollowingRow profile={follower} />
        })
    }

    const getFollowers = (page) => {
        dispatch(actions.getFollowers({ page: page, profileId }));
    }

    React.useEffect(() => {
        dispatch(actions.getFollowers({ page: 1, profileId }))
    }, []);

    React.useEffect(() => {
    }, [followerTotalPage, followerCurrentPage]);

    return (
        <Modal
            visible={showModal}
            onCancel={() => setShowModal(false)}
            title={'Followers'}
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ style: { display: 'none' } }}>
            <InfiniteScroll
                pageStart={1}
                loadMore={getFollowers}
                hasMore={followerCurrentPage < followerTotalPage}
                loader={<Spin spinning={true}></Spin>}>

                {renderFollowers()}
            </InfiniteScroll>
        </Modal >
    )
}