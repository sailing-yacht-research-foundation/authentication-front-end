import React from 'react';
import { Modal, Spin, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../../slice';
import { selectFollowing, selectFollowingCurrentPage, selectFollowingTotalRecords, selectModalLoading } from '../../slice/selectors';
import { UserFollowerFollowingRow } from 'app/components/SocialProfile/UserFollowerFollowingRow';
import { PaginationContainer } from 'app/components/SyrfGeneral';

export const FollowingModal = ({ profileId, showModal, setShowModal, reloadParent }) => {

    const followings = useSelector(selectFollowing);

    const dispatch = useDispatch();

    const { actions } = usePublicProfileSlice();

    const followingCurrentPage = useSelector(selectFollowingCurrentPage);

    const followingTotalRecords = useSelector(selectFollowingTotalRecords);

    const isLoading = useSelector(selectModalLoading);

    const [performedAction, setPerformedAction] = React.useState<boolean>(false);

    const renderFollowings = () => {
        return followings.map(following => {
            return <UserFollowerFollowingRow setPerformedAction={setPerformedAction} profileId={following.followingId} profile={following} />
        })
    }

    const getFollowing = (page) => {
        dispatch(actions.getFollowing({ page: page, profileId }));
    }

    const hideModal = () => {
        setShowModal(false);
        if (performedAction) {
            reloadParent();
        }
    }

    React.useEffect(() => {
        dispatch(actions.getFollowing({ page: 1, profileId }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId]);

    return (
        <Modal
            visible={showModal}
            onCancel={hideModal}
            title={'Following'}
            footer={null}>
            <Spin spinning={isLoading}>
                {renderFollowings()}
                {followingTotalRecords > 10 && <PaginationContainer>
                    <Pagination current={followingCurrentPage} onChange={(page) => getFollowing(page)} total={followingTotalRecords} />
                </PaginationContainer>}
            </Spin>
        </Modal >
    )
}