import React from 'react';
import { Modal, Spin, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../../slice';
import { selectFollowing, selectFollowingCurrentPage, selectFollowingPageSize, selectFollowingTotalRecords, selectModalLoading } from '../../slice/selectors';
import { UserFollowerFollowingRow } from 'app/components/SocialProfile/UserFollowerFollowingRow';
import { PaginationContainer } from 'app/components/SyrfGeneral';
import { DEFAULT_PAGE_SIZE } from 'utils/constants';

export const FollowingModal = ({ profileId, showModal, setShowModal, reloadParent }) => {

    const followings = useSelector(selectFollowing);

    const dispatch = useDispatch();

    const { actions } = usePublicProfileSlice();

    const followingCurrentPage = useSelector(selectFollowingCurrentPage);

    const followingTotalRecords = useSelector(selectFollowingTotalRecords);

    const isLoading = useSelector(selectModalLoading);

    const followingPageSize = useSelector(selectFollowingPageSize);

    const [performedAction, setPerformedAction] = React.useState<boolean>(false);

    const renderFollowings = () => {
        return followings.map(following => {
            return <UserFollowerFollowingRow key={following.followingId} setPerformedAction={setPerformedAction} profileId={following.followingId} profile={following} />
        })
    }

    const getFollowing = (page, size) => {
        dispatch(actions.getFollowing({ page: page, size: size, profileId }));
    }

    const hideModal = () => {
        setShowModal(false);
        if (performedAction) {
            reloadParent();
        }
    }

    React.useEffect(() => {
        dispatch(actions.getFollowing({ page: 1, size: 10, profileId }));
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
                {followingTotalRecords > DEFAULT_PAGE_SIZE && <PaginationContainer>
                    <Pagination
                        current={followingCurrentPage}
                        onChange={(page, size) => getFollowing(page, size)}
                        pageSize={followingPageSize}
                        total={followingTotalRecords} />
                </PaginationContainer>}
            </Spin>
        </Modal >
    )
}