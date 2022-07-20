import React from 'react';
import { Modal, Spin, Pagination } from 'antd';
import { RequestItem } from './RequestItem';
import { PaginationContainer } from '../SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { useDispatch, useSelector } from 'react-redux';
import { selectPagination, selectShowFollowRequestModal } from './slice/selector';
import { useSocialSlice } from './slice';
import { DEFAULT_PAGE_SIZE } from 'utils/constants';

export const FollowRequestModal = () => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const showFollowRequestModal = useSelector(selectShowFollowRequestModal);

    const dispatch = useDispatch();

    const { actions } = useSocialSlice();

    const { t } = useTranslation();

    const pagination = useSelector(selectPagination);

    const reload = () => {
        getFollowRequests(pagination.page, pagination.size);
    }

    const renderFollowRequests = () => {
        if (pagination.rows.length > 0)
            return pagination.rows.map(request => <RequestItem key={request.id} hideModal={hideRequestModal} reloadParentList={reload} request={request} />);
        return <span>{t(translations.public_profile.you_dont_have_any_follow_requests)}</span>
    }

    const getFollowRequests = async (page: number, size) => {
        setIsLoading(true);
        dispatch(actions.getFollowRequests({ page, size }));
        setIsLoading(false);
    }

    const hideRequestModal = () => {
        dispatch(actions.setShowFollowRequestModal(false));
    }

    return (
        <Modal visible={showFollowRequestModal} footer={null} title={t(translations.public_profile.requested_to_follow_you)} onCancel={hideRequestModal}>
            <Spin spinning={isLoading}>
                {renderFollowRequests()}
                {pagination.total > DEFAULT_PAGE_SIZE && <PaginationContainer>
                    <Pagination current={pagination.page} total={pagination.total} pageSize={pagination.pageSize} onChange={(page, pageSize) => getFollowRequests(page, pageSize)} />
                </PaginationContainer>}
            </Spin>
        </Modal>
    );
}
