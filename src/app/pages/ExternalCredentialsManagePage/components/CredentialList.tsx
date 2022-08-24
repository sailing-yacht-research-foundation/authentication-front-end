import * as React from 'react';
import styled from 'styled-components';
import { ProfileTabs } from './../../ProfilePage/components/ProfileTabs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { BorderedButton, DeleteButton, LottieMessage, LottieWrapper, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, TableWrapper } from 'app/components/SyrfGeneral';
import { Table, Spin, Space, Tooltip } from 'antd';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-credentials.json';
import { getCredentialByPage, removeCredential } from 'services/live-data-server/external-platform';
import { CreateButton } from 'app/components/SyrfGeneral';
import { AiFillPlusCircle } from 'react-icons/ai';
import { LinkNewCredentialModal } from './modals/LinkNewCredentialModal';
import { MODE } from 'utils/constants';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { toast } from 'react-toastify';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { Credential } from 'types/Credential';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const CredentialList = () => {

    const { t } = useTranslation();

    const columns = [
        {
            title: t(translations.credentail_manager_page.username),
            dataIndex: 'userId',
            key: 'userId',
            render: (text, record) => {
                return text;
            }
        },
        {
            title: t(translations.credentail_manager_page.source),
            dataIndex: 'source',
            key: 'source',
            render: (text, record) => {
                return text;
            }
        },
        {
            title: t(translations.general.action),
            key: 'action',
            render: (text, record) => {
                return <Space size={10}>
                    <BorderedButton type="primary" onClick={() => showUpdateCredentialModal(record)}>{t(translations.credentail_manager_page.edit)}</BorderedButton>
                    <DeleteButton danger onClick={() => {
                        showDeleteCredentialModal(record)
                    }}>{t(translations.credentail_manager_page.unlink)}</DeleteButton>
                </Space>;
            }
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [showCreateModal, setShowCreateModal] = React.useState<boolean>(false);

    const [credential, setCredential] = React.useState<Partial<Credential>>({});

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    const [isDeletingCredential, setIsDeletingCredential] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    React.useEffect(() => {
        getAll(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAll = async (page: number) => {
        setIsChangingPage(true);
        const response = await getCredentialByPage({ page, size: 10 });
        setIsChangingPage(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page,
                total: response.data?.count
            });
        }
    }

    const onPaginationChanged = (page: number) => {
        getAll(page);
    }

    const showDeleteCredentialModal = (credential: Credential) => {
        setShowDeleteModal(true);
        setCredential(credential);
    }

    const showUpdateCredentialModal = (credential: Credential) => {
        setShowCreateModal(true);
        setMode(MODE.UPDATE);
        setCredential(credential);
    }

    const onCredentialDeleted = () => {
        getAll(pagination.page);
    }

    const showCreateCredentialModal = () => {
        setMode(MODE.CREATE);
        setCredential({});
        setShowCreateModal(true);
    }

    const performDeleteCredential = async () => {
        setIsDeletingCredential(true);
        const response = await removeCredential(credential.id!);
        setIsDeletingCredential(false);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_credential_modal.successfully_deleted));
            onCredentialDeleted();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Wrapper>
            <ProfileTabs />
            <ConfirmModal
                loading={isDeletingCredential}
                showModal={showDeleteModal}
                onOk={performDeleteCredential}
                onCancel={() => setShowDeleteModal(false)}
                title={t(translations.delete_credential_modal.are_you_sure_you_want_to_delete)}
                content={t(translations.delete_credential_modal.you_will_delete)} />
            <LinkNewCredentialModal mode={mode} credential={credential} reloadParent={() => getAll(pagination.page)} showModal={showCreateModal} setShowModal={setShowCreateModal} />
            <>
                <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                    <PageInfoContainer>
                        <PageHeading>{t(translations.credentail_manager_page.credentials)}</PageHeading>
                        <PageDescription>{t(translations.credentail_manager_page.this_is_where_you_can_manage_your_credential_you_linked)}</PageDescription>
                    </PageInfoContainer>
                    <Tooltip title={t(translations.tip.link_a_new_credential_to_your_account)}>
                        <CreateButton
                            onClick={showCreateCredentialModal} icon={<AiFillPlusCircle
                                style={{ marginRight: '5px' }}
                                size={18} />}>
                            {t(translations.credentail_manager_page.link_new_credential)}
                        </CreateButton>
                    </Tooltip>
                </PageHeaderContainerResponsive>
                {pagination.rows.length > 0 ? (
                    <Spin spinning={isChangingPage}>
                        <TableWrapper>
                            <Table scroll={{ x: "max-content" }} columns={columns}
                                dataSource={pagination.rows} pagination={{
                                    defaultPageSize: 10,
                                    current: pagination.page,
                                    total: pagination.total,
                                    onChange: onPaginationChanged
                                }} />

                        </TableWrapper>
                    </Spin>
                )
                    : (<LottieWrapper>
                        <Lottie
                            options={defaultOptions}
                            height={400}
                            width={400} />
                        <LottieMessage>{t(translations.credentail_manager_page.you_havent_linked_any_credentials)}</LottieMessage>
                    </LottieWrapper>)}
            </>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-top: 132px;
`;

