import React from 'react';
import styled from 'styled-components';
import { Modal, Spin } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { UserFollowerFollowingRow } from 'app/components/UserFollowerFollowingRow';
import { getTopRecommandation } from 'services/live-data-server/profile';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getUserAttribute } from 'utils/user-utils';
import InfiniteScroll from 'react-infinite-scroller';
import { SpinLoadMoreContainer } from 'app/components/SyrfGeneral';

export const PeopleYouMayKnowModal = (props) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, reloadParentList } = props;

    const currentUserId = localStorage.getItem('user_id');

    const user = useSelector(selectUser);

    const renderProfiles = () => {
        return pagination.rows.map(profile => <UserFollowerFollowingRow profile={profile} profileId={profile.id} />);
    }

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        totalPages: 1,
    });

    const getPeopleYouMayKnow = async (page) => {
        const response = await getTopRecommandation({ locale: getUserAttribute(user, 'locale'), page, size: 10 });

        if (response.success) {
            const rows = response.data?.rows.filter(profile => currentUserId !== profile.id);
            setPagination({
                ...pagination,
                rows: [...pagination.rows, ...rows],
                total: response?.data?.count,
                page: page,
                totalPages: response.data?.count < 10 ? 1 : Math.ceil(response.data?.count / 10)
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
            getPeopleYouMayKnow(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <Modal visible={showModal} title={'People you may know'} footer={null} onCancel={hideModal}>
            <InfiniteScroll
                pageStart={1}
                loadMore={getPeopleYouMayKnow}
                hasMore={pagination.page < pagination.totalPages}
                loader={<SpinLoadMoreContainer>
                    <Spin spinning={true}></Spin>
                </SpinLoadMoreContainer>}>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {renderProfiles()}
                </div>
            </InfiniteScroll>
        </Modal >
    );
}