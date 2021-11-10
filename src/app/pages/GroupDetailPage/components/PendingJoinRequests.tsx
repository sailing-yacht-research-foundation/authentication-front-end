import React from 'react';
import styled from 'styled-components';
import { SectionContainer, SectionTitle, PaginationContainer, SectionTitleWrapper } from './Members';
import { UserItemRow } from './UserItemRow';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { adminAcceptJoinRequest, getUserJoinRequests } from 'services/live-data-server/groups';
import { Button, Pagination, Space, Spin } from 'antd';
import { BiCheckCircle } from 'react-icons/bi';
import { MdRemoveCircle } from 'react-icons/md';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { GroupMemberStatus } from 'utils/constants';

export const PendingJoinRequests = (props) => {

    const { t } = useTranslation();

    const { groupId } = useParams<{ groupId: string }>();

    const { group } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const renderRequests = () => {
        return pagination.rows.map(item => <UserItemRow item={item} buttons={renderActionButton(item)} />);
    }

    const onPaginationChanged = (page) => {
        getJoinRequests(page);
    }

    const getJoinRequests = async (page) => {
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

    const decideJoinRequest = async (request, status) => {
        setIsLoading(true);
        const response = await adminAcceptJoinRequest(request.id, status);
        setIsLoading(false);

        if (response.success) {
            getJoinRequests(pagination.page);
        } else {
            toast.error(t(translations.group.an_error_happened_when_performing_your_request));
        }
    }

    React.useEffect(() => {
        getJoinRequests(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderActionButton = (member) => {
        return (
            <Space size={10}>
                <Button type="primary" onClick={() => decideJoinRequest(member, GroupMemberStatus.accepted)} icon={<BiCheckCircle style={{ marginRight: '5px' }} />}>
                    {t(translations.group.accept)}
                </Button>
                <Button onClick={() => decideJoinRequest(member, GroupMemberStatus.declined)} icon={<MdRemoveCircle style={{ marginRight: '5px' }} />} danger>
                    {t(translations.group.reject)}
                </Button>
            </Space>
        );
    }

    return (
        <>
            {
                ((pagination.total > 0) && group.isAdmin) && <SectionContainer>
                    <SectionTitleWrapper>
                        <SectionTitle>{t(translations.group.pending_join_requests)} ({pagination.total})</SectionTitle>
                    </SectionTitleWrapper>
                    <Spin spinning={isLoading}>
                        <MemberList>
                            {renderRequests()}
                        </MemberList>
                        {
                            (pagination.total > 10) && <PaginationContainer>
                                <Pagination defaultCurrent={pagination.page} current={pagination.page} onChange={onPaginationChanged} total={pagination.total} />
                            </PaginationContainer>
                        }
                    </Spin>
                </SectionContainer>
            }
        </>
    );
}

const MemberList = styled.div``;