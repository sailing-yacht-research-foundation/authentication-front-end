import React from 'react';
import { Modal, Button, Space, Pagination, Spin } from 'antd';
import styled from 'styled-components';
import { UserItemRow } from '../UserItemRow';
import { getUserJoinRequests } from 'services/live-data-server/groups';
import { BiCheckCircle } from 'react-icons/bi';
import { MdRemoveCircle } from 'react-icons/md';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export const UserApprovalModal = (props) => {

    const { t } = useTranslation();

    const { groupId } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const getJoinRequests = async (page: number) => {
        setIsLoading(true);
        const response = await getUserJoinRequests(groupId, page);
        setIsLoading(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page,
                total: response.data?.count
            });
        }
    }

    const renderAdmins = () => {
        return pagination.rows.map((item, index) => <UserItemRow key={index} item={item} buttons={renderActionButtons()} />);
    }

    const onPaginationChanged = (page: number) => {
        getJoinRequests(page);
    }

    React.useEffect(() => {
        getJoinRequests(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const renderActionButtons = () => {
        return (
            <Space size={10}>
                <Button type="primary" icon={<BiCheckCircle style={{ marginRight: '5px' }} />}>
                    {t(translations.general.accept)}
                </Button>
                <Button icon={<MdRemoveCircle style={{ marginRight: '5px' }} />} danger>
                    {t(translations.general.reject)}
                </Button>
            </Space>
        );
    }

    return (
        <Modal
            title={'Admin Manager'}
            visible={true}
        >
            <Spin spinning={isLoading}>
                <AdminContainer>
                    {renderAdmins()}
                </AdminContainer>
                <PaginationContainer>
                    <Pagination defaultCurrent={pagination.page} current={pagination.page} onChange={onPaginationChanged} total={pagination.total} />
                </PaginationContainer>
            </Spin>
        </Modal>
    )
}

const AdminContainer = styled.div`

`;

const PaginationContainer = styled.div`
    text-align: right;
`;
