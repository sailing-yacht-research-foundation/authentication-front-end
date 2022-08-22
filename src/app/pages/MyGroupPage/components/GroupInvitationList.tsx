import React from 'react';
import styled from 'styled-components';
import { GroupInvitationItemRow } from './GroupInvitationItemRow';
import { getGroupInvitations } from 'services/live-data-server/groups';
import { Spin } from 'antd';
import { InvitationModal } from './InvitationModal';
import { media } from 'styles/media';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { DEFAULT_PAGE_SIZE, GroupMemberStatus } from 'utils/constants';

export const GroupInvitationList = () => {

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const showInvitationModal = (e) => {
        e.preventDefault();
        setShowModal(true);
    }

    const getInvitations = async (page, size) => {
        setIsLoading(true);
        const response = await getGroupInvitations(page, size, GroupMemberStatus.INVITED);
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

    const reloadParentList = () => {
        getInvitations(1, DEFAULT_PAGE_SIZE);
    }

    const renderInvitationItem = () => {
        if (pagination.rows.length > 0)
            return pagination.rows.map(request => <GroupInvitationItemRow key={request.id} reloadParentList={reloadParentList} setIsLoading={setIsLoading} request={request} />);
        return <EmptyInvitationMessage>{t(translations.group.you_dont_have_any_invitations_right_now)}</EmptyInvitationMessage>
    }

    React.useEffect(() => {
        getInvitations(1, DEFAULT_PAGE_SIZE);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            {pagination.total > DEFAULT_PAGE_SIZE && <InvitationModal reloadParentList={reloadParentList} showModal={showModal} setShowModal={setShowModal} />}
            <TitleContainer>
                <Title>{t(translations.group.invitations, { invitationsTotal: pagination.total })}</Title>
                {pagination.total > DEFAULT_PAGE_SIZE && <SeeAll onClick={showInvitationModal}>{t(translations.group.see_all)}</SeeAll>}
            </TitleContainer>
            <Spin spinning={isLoading}>
                <InvitationList>
                    {renderInvitationItem()}
                </InvitationList>
            </Spin>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    border-radius: 5px;
    padding: 15px;
    background: #fff;
    width: 100%;
    border: 1px solid #eee;

    ${media.medium`
        display: block;
    `}
`;

const Title = styled.h3``;

const InvitationList = styled.div``;

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const SeeAll = styled.a``;

const EmptyInvitationMessage = styled.span``;
