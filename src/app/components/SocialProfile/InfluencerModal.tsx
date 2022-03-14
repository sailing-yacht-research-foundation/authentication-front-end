import React from 'react';
import { Modal, Pagination, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserFollowerFollowingRow } from 'app/components/SocialProfile/UserFollowerFollowingRow';
import { getHotRecommandation } from 'services/live-data-server/profile';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getUserAttribute } from 'utils/user-utils';
import { PaginationContainer } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import { useLocation } from 'react-router-dom';

interface IInfluencerModal {
    showModal: boolean,
    setShowModal: Function,
    reloadParentList?: Function
}

export const InfluencerModal = ({ showModal, setShowModal, reloadParentList }: IInfluencerModal) => {

    const { t } = useTranslation();

    const currentUserId = localStorage.getItem('user_id');

    const user = useSelector(selectUser);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const location = useLocation();

    const renderProfiles = () => {
        return pagination.rows.map(profile => <UserFollowerFollowingRow key={profile.id} profile={profile} profileId={profile.id} />);
    }

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        size: 10
    });

    const getInfluencers = async (page, size) => {
        setIsLoading(true);
        const response = await getHotRecommandation({ locale: getUserAttribute(user, 'locale'), page, size });
        setIsLoading(false);

        if (response.success) {
            const rows = response.data?.rows.filter(profile => currentUserId !== profile.id);
            setPagination({
                ...pagination,
                rows: rows,
                total: response?.data?.count,
                page: page,
                size: size
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
        hideModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    React.useEffect(() => {
        if (user)
            getInfluencers(1, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <Modal visible={showModal} title={t(translations.public_profile.top_influencers)} footer={null} onCancel={hideModal}>
            <Spin spinning={isLoading}>
                {renderProfiles()}
                {
                    pagination.total > 10 && <PaginationContainer>
                        <Pagination current={pagination.page} onChange={(page, size) => getInfluencers(page, size)} total={pagination.total} />
                    </PaginationContainer>
                }
            </Spin>
        </Modal>
    );
}