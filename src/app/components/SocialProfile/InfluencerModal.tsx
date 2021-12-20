import React from 'react';
import { Modal, Pagination, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserFollowerFollowingRow } from 'app/components/SocialProfile/UserFollowerFollowingRow';
import { getHotRecommandation } from 'services/live-data-server/profile';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getUserAttribute } from 'utils/user-utils';
import { PaginationContainer } from 'app/components/SyrfGeneral';

export const InfluencerModal = (props) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, reloadParentList } = props;

    const currentUserId = localStorage.getItem('user_id');

    const user = useSelector(selectUser);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const renderProfiles = () => {
        return pagination.rows.map(profile => <UserFollowerFollowingRow profile={profile} profileId={profile.id} />);
    }

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const getInfluencers = async (page) => {
        setIsLoading(true);
        const response = await getHotRecommandation({ locale: getUserAttribute(user, 'locale'), page, size: 10 });
        setIsLoading(false);
        
        if (response.success) {
            const rows = response.data?.rows.filter(profile => currentUserId !== profile.id);
            setPagination({
                ...pagination,
                rows: rows,
                total: response?.data?.count,
                page: page
            })
        }
    }

    const hideModal = () => {
        if (reloadParentList) {
            reloadParentList();
        }
        setShowModal(false);
    }

    React.useEffect(() => {
        if (user)
            getInfluencers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <Modal visible={showModal} title={'Top influencers'} footer={null} onCancel={hideModal}>
            <Spin spinning={isLoading}>
                {renderProfiles()}
                {
                    pagination.total > 10 && <PaginationContainer>
                        <Pagination current={pagination.page} onChange={(page) => getInfluencers(page)} total={pagination.total} />
                    </PaginationContainer>
                }
            </Spin>
        </Modal>
    );
}