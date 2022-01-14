import React from 'react';
import { Modal, Spin, Pagination } from 'antd';
import { RequestItem } from './RequestItem';
import { getRequestedFollowRequests } from '../../../services/live-data-server/profile';
import { PaginationContainer } from '../SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';


export const FollowRequestModal = (props) => {

    const { showModal, setShowModal, reloadFollowRequestsCount } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const reload = () => {
        getFollowRequests(pagination.page);
        if (reloadFollowRequestsCount && typeof reloadFollowRequestsCount === 'function')
            reloadFollowRequestsCount();
    }

    const renderFollowRequests = () => {
        if (pagination.rows.length > 0)
            return pagination.rows.map(request => <RequestItem key={request.id} hideModal={() => setShowModal(false)} reloadParentList={reload} request={request} />);
        return <span>{t(translations.public_profile.you_dont_have_any_follow_requests)}</span>
    }

    const getFollowRequests = async (page) => {
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

    const hideInvitationModal = () => {
        setShowModal(false);
    }

    React.useEffect(() => {
        getFollowRequests(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal visible={showModal} footer={null} title={t(translations.public_profile.requested_to_follow_you)} onCancel={hideInvitationModal}>
            <Spin spinning={isLoading}>
                {renderFollowRequests()}
                {pagination.total > 10 && <PaginationContainer>
                    <Pagination current={pagination.page} total={pagination.total} onChange={(page) => getFollowRequests(page)} />
                </PaginationContainer>}
            </Spin>
        </Modal>
    );
}