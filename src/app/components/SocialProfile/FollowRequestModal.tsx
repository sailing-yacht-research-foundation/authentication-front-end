import React from 'react';
import { Modal, Spin, Pagination } from 'antd';
import { RequestItem } from './RequestItem';
import { getRequestedFollowRequests } from '../../../services/live-data-server/profile';
import { PaginationContainer } from '../SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowFollowRequestModal } from './slice/selector';
import { useSocialSlice } from './slice';
import { DEFAULT_PAGE_SIZE } from 'utils/constants';

export const FollowRequestModal = () => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const showFollowRequestModal = useSelector(selectShowFollowRequestModal);

    const dispatch = useDispatch();

    const { actions } = useSocialSlice();

    const { t } = useTranslation();

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const reload = () => {
        getFollowRequests(pagination.page);
    }

    const renderFollowRequests = () => {
        if (pagination.rows.length > 0)
            return pagination.rows.map(request => <RequestItem key={request.id} hideModal={hideRequestModal} reloadParentList={reload} request={request} />);
        return <span>{t(translations.public_profile.you_dont_have_any_follow_requests)}</span>
    }

    const getFollowRequests = async (page: number) => {
        setIsLoading(true);
        const response = await getRequestedFollowRequests(page);
        setIsLoading(false);

        if (response.success) {
            setPagination({
                ...pagination,
                page: page,
                total: response?.data?.count,
                rows: response.data?.rows,
            });
        }
    }

    const hideRequestModal = () => {
        dispatch(actions.setShowFollowRequestModal(false));
    }

    React.useEffect(() => {
        getFollowRequests(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal visible={showFollowRequestModal} footer={null} title={t(translations.public_profile.requested_to_follow_you)} onCancel={hideRequestModal}>
            <Spin spinning={isLoading}>
                {renderFollowRequests()}
                {pagination.total > DEFAULT_PAGE_SIZE && <PaginationContainer>
                    <Pagination current={pagination.page} total={pagination.total} onChange={(page) => getFollowRequests(page)} />
                </PaginationContainer>}
            </Spin>
        </Modal>
    );
}